import cv2
from flask import Flask, Response
from ultralytics import YOLO

# Initialize Flask app
app = Flask(__name__)

# Load the TFLite model
model = YOLO('yolov8n.pt') 

SAFE_LIMIT = 5
WARNING_LIMIT = 15

# Connect to the IP Webcam feed (⚠️ REPLACE THIS WITH YOUR EXACT PHONE URL)
video_url = "http://192.168.168.48:8080/video" 

def generate_frames():
    cap = cv2.VideoCapture(video_url)
    
    if not cap.isOpened():
        print(f"CRITICAL ERROR: OpenCV cannot connect to {video_url}. Check the phone app!")
    
    frame_counter = 0

    while True:
        try: # [cite: 290]
            success, frame = cap.read()
            
            # 1. Check if the camera is sending empty frames
            if not success:
                print("DEBUG ERROR: Camera connected, but sending empty frames!")
                break
                
            frame_counter += 1
            
            # Frame skipping: only process every 3rd frame to maintain FPS on CPU
            if frame_counter % 3 != 0:
                continue

            # Resize for speed
            frame = cv2.resize(frame, (640, 480), interpolation=cv2.INTER_NEAREST)

            # Run TFLite Inference
            results = model(frame, classes=[0], conf=0.40, iou=0.30)
            people_count = len(results[0].boxes)

            # Determine UI Overlay Color based on density limits
            if people_count <= SAFE_LIMIT:
                overlay_color = (0, 255, 0)      # Green
                status_text = "Density: LOW"
            elif people_count <= WARNING_LIMIT:
                overlay_color = (0, 255, 255)    # Yellow
                status_text = "Density: MEDIUM"
            else:
                overlay_color = (0, 0, 255)      # Red
                status_text = "Density: HIGH"

            # Draw the UI Overlay
            annotated_frame = results[0].plot()
            h, w = annotated_frame.shape[:2]
            
            # Create semi-transparent bounding box
            overlay = annotated_frame.copy()
            cv2.rectangle(overlay, (10, 10), (w - 10, h - 10), overlay_color, thickness=15)
            alpha = 0.6
            cv2.addWeighted(overlay, alpha, annotated_frame, 1 - alpha, 0, annotated_frame)

            # Create solid background box for the text
            cv2.rectangle(annotated_frame, (15, 15), (350, 60), (0, 0, 0), -1)
            cv2.putText(annotated_frame, f"{status_text} ({people_count})", (25, 45),
                        cv2.FONT_HERSHEY_DUPLEX, 0.8, overlay_color, 2)

            # INSTEAD OF cv2.imshow, we encode the frame as a JPEG for the web stream
            ret, buffer = cv2.imencode('.jpg', annotated_frame)
            frame_bytes = buffer.tobytes()

            # Yield the frame in byte format for the web stream
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
                   
        # 2. Catch and print any hidden YOLO/OpenCV crashes [cite: 292]
        except Exception as e:
            print(f"\n❌ PYTHON CRASHED INSIDE THE LOOP: {e}\n")
            break

    cap.release()

# Route to serve the video feed
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# Basic HTML page to display the feed nicely
@app.route('/')
def index():
    return '''
    <html>
        <head>
            <title>Crowd Density Monitor</title>
            <style>
                body { background-color: #121212; color: white; text-align: center; font-family: sans-serif; }
                img { max-width: 100%; height: auto; border: 2px solid #333; margin-top: 20px; }
            </style>
        </head>
        <body>
            <h2>Live Crowd Density Dashboard</h2>
            <img src="/video_feed" />
        </body>
    </html>
    '''

if __name__ == '__main__':
    # host='0.0.0.0' exposes the server to your local network [cite: 203, 204]
    app.run(host='0.0.0.0', port=5000, debug=False)