import cv2
import numpy as np
from ultralytics import YOLO

# 1. Load the exported TensorFlow Lite model
# Ensure this path matches where your exported .tflite file is located
model = YOLO('yolov8n_float16.tflite') 

# 2. Set your density thresholds
# Adjust these based on what constitutes "crowded" for your specific camera view/ROI
SAFE_LIMIT = 5
WARNING_LIMIT = 15

# 3. Connect to the camera (replace with your IP webcam URL or use 0 for local webcam)
video_url = "http://192.168.168.48" \
":8080/video" 
cap = cv2.VideoCapture(video_url)

if not cap.isOpened():
    print("Error: Could not open video stream.")
    exit()

while True:
    success, frame = cap.read()
    if not success:
        break

    # Optional: Resize for performance
    frame = cv2.resize(frame, (640, 480),interpolation=cv2.INTER_NEAREST)

    # 4. Run TFLite Inference for 'person' (class 0)
    results = model(frame,classes=[0], conf=0.45,iou=0.30)
    
    # Calculate density (using simple count here; divide by area if you have a defined ROI)
    people_count = len(results[0].boxes)
    print(f"DEBUG: Found {people_count} objects in this frame.") # Add this line

    # 5. Determine UI Overlay Color (BGR format for OpenCV)
    if people_count <= SAFE_LIMIT:
        overlay_color = (0, 255, 0)      # Green
        status_text = "Density: LOW"
    elif people_count <= WARNING_LIMIT:
        overlay_color = (0, 255, 255)    # Yellow
        status_text = "Density: MEDIUM"
    else:
        overlay_color = (0, 0, 255)      # Red
        status_text = "Density: HIGH"

    # 6. Draw the UI Overlay
    # Draw the bounding boxes from the model
    annotated_frame = results[0].plot()
    
    # Create a semi-transparent border around the entire frame
    overlay = annotated_frame.copy()
    cv2.rectangle(overlay, (0, 0), (frame.shape[1], frame.shape[0]), overlay_color, thickness=20)
    
    # Blend the border so it's slightly transparent
    alpha = 0.6
    cv2.addWeighted(overlay, alpha, annotated_frame, 1 - alpha, 0, annotated_frame)

    # Add a solid background box for the text to make it readable
    cv2.rectangle(annotated_frame, (10, 10), (350, 60), (0, 0, 0), -1)
    
    # Add the status text
    cv2.putText(annotated_frame, f"{status_text} ({people_count})", (20, 45),
                cv2.FONT_HERSHEY_DUPLEX, 0.8, overlay_color, 2)

    # Display the feed
    cv2.imshow("Hackathon Crowd Tracker (TF Lite)", annotated_frame)

    # Press 'q' to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()