import cv2
from flask import Flask, Response
from ultralytics import YOLO

# Initialize Flask app
app = Flask(__name__)

# Load the TFLite model for edge-optimized inference
model = YOLO('yolov8n_float32.tflite')

# Multi-camera configuration
CAMERAS = {
    "cam1": "http://192.168.168.101:8080/video",  # Update with your actual IP Webcam URLs
    "cam2": "http://192.168.168.48:8080/video"
}
current_camera_key = "cam1"

# Thresholds for crowd density
SAFE_LIMIT = 5
WARNING_LIMIT = 10

def generate_frames():
    global current_camera_key
    
    active_url = CAMERAS[current_camera_key]
    cap = cv2.VideoCapture(active_url)
    frame_counter = 0

    while True:
        try:
            # Seamless Camera Switching Interception
            if CAMERAS[current_camera_key] != active_url:
                cap.release() # Drop the old connection
                active_url = CAMERAS[current_camera_key]
                cap = cv2.VideoCapture(active_url) # Connect to the new phone

            success, frame = cap.read()
            
            # Check for empty frames
            if not success:
                print("DEBUG ERROR: Camera connected, but sending empty frames!")
                continue
                
            # Frame skipping optimization: process every 3rd frame
            frame_counter += 1
            if frame_counter % 3 != 0:
                continue

            # Orientation and Resize Fixes for Portrait Mode
            frame = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)
            frame = cv2.resize(frame, (480, 640), interpolation=cv2.INTER_NEAREST)

            # YOLO Inference (Tuned for people only, with strict NMS/IoU)
            results = model(frame, classes=[0], conf=0.35, iou=0.30)
            people_count = len(results[0].boxes)

            # Dynamic UI Overlay Logic
            if people_count <= SAFE_LIMIT:
                overlay_color = (0, 255, 0)      # Green
                status_text = "Density: LOW"
            elif people_count <= WARNING_LIMIT:
                overlay_color = (0, 255, 255)    # Yellow
                status_text = "Density: MEDIUM"
            else:
                overlay_color = (0, 0, 255)      # Red
                status_text = "Density: HIGH"

            # Draw the UI
            annotated_frame = results[0].plot()
            cv2.rectangle(annotated_frame, (10, 10), (470, 630), overlay_color, thickness=15)
            
            # Background box for text readability
            cv2.rectangle(annotated_frame, (15, 15), (350, 60), (0, 0, 0), -1)
            cv2.putText(annotated_frame, f"{status_text} ({people_count})", (25, 45),
                        cv2.FONT_HERSHEY_DUPLEX, 0.8, overlay_color, 2)

            # Encode frame for Flask web stream
            ret, buffer = cv2.imencode('.jpg', annotated_frame)
            frame_bytes = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
                   
        except Exception as e:
            # Diagnostic safety net
            print(f"\n❌ PYTHON CRASHED INSIDE THE LOOP: {e}\n")
            break

    cap.release()

# Route to handle background camera switching
@app.route('/switch_camera/<camera_id>')
def switch_camera(camera_id):
    global current_camera_key
    if camera_id in CAMERAS:
        current_camera_key = camera_id
        return "Switched successfully", 200
    return "Camera not found", 404

# Route to serve the video feed
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# Multi-Camera Frontend Dashboard
@app.route('/')
def index():
    return '''
    <html>
        <head>
            <title>Multi-Cam Crowd Density</title>
            <style>
                body { background-color: #121212; color: white; text-align: center; font-family: sans-serif; }
                img { max-width: 100%; height: auto; border: 2px solid #333; margin-top: 20px; }
                .btn { 
                    padding: 10px 20px; margin: 10px; font-size: 16px; 
                    background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;
                }
                .btn:hover { background-color: #0056b3; }
            </style>
            <script>
                // Calls the backend to switch cameras without reloading the page
                function switchCam(camId) {
                    fetch('/switch_camera/' + camId)
                        .then(response => console.log('Requested switch to ' + camId));
                }
            </script>
        </head>
        <body>
            <h2>Live Crowd Density Dashboard</h2>
            
            <div>
                <button class="btn" onclick="switchCam('cam1')">View Camera 1</button>
                <button class="btn" onclick="switchCam('cam2')">View Camera 2</button>
            </div>

            <img id="videoStream" src="/video_feed" />
        </body>
    </html>
    '''

if __name__ == '__main__':
    # Listen on all IP addresses to broadcast to the mobile device
    app.run(host='0.0.0.0', port=5000, debug=False)