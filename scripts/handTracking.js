function handTrackingFrame() {
    //Flip webcam video
    /*push();
    translate(width, 0);
    scale(-1, 1);
    image(video, posCamaraX, posCamaraY);
    pop();*/

    let rightHandIsShowed = false;

    //Draw hands
    //Draw the tracked hands
    if (hands.length > 0) {
        console.log("Mano deteccion - Mano derecha: " + rightHandIsShowed);
        rightHandIsShowed = false;
        for (let handIndex of hands) {
            console.log("Entramos bucle: " + handIndex.handedness);
            if (handIndex.confidence > 0.1) {
                // Loop through keypoints and draw circles
                for (let i = 0; i < handIndex.keypoints.length; i++) {
                    let keypoint = handIndex.keypoints[i];
                    drawHands(handIndex, keypoint.x, keypoint.y);


                }


                if (handIndex.handedness == "Left") {
                    scaleHandGesture(handIndex);
                } else {
                    if (!rightHandIsShowed) {
                        rightHandIsShowed = true;
                    }
                }

            }
        }
    } else {
        console.log(rightHandIsShowed);
        if (rightHandIsShowed) {
            rightHandIsShowed = false;
        } 
    }

    //Right hand is detected activate 
    if (rightHandIsShowed) {
        if (poligonMode) {
            poligonMode = false;
        }
    } else {
        if (!poligonMode) {
            poligonMode = true;
        }
    }
}


function drawHands(hand, posX, posY) {

    // Color-code based on left or right hand
    if (hand.handedness == "Left") {
        fill(255, 0, 255);
    } else {
        fill(255, 255, 0);
    }

    noStroke();
    circle(posX, posY, 16);

}


//Returns the distance among two vectors
function distanceTwoVectors(indexFinger, thumbFinger) {
    let x = Math.abs(indexFinger.x - thumbFinger.x);
    let y = Math.abs(indexFinger.y - thumbFinger.y);
    //console.log("X: " + x + "   Y: " + y);
    let distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    //console.log("Distance: " + distance);
    return distance;
}


//Método que actualiza el servo de la pinza
function scaleHandGesture(hand) {
    //Actualizamos la info de los dedos
    indexFinger = hand.keypoints[8];
    thumbFinger = hand.keypoints[4];
    stroke("red");
    line(indexFinger.x, indexFinger.y, thumbFinger.x, thumbFinger.y);
    //Creamos la info a enviar si cumple con los bordes de tracking
    if (indexFinger.x >= 0 && indexFinger.x <= 1200 &&
        indexFinger.y >= 0 && indexFinger.y <= 600 &&
        thumbFinger.x >= 0 && thumbFinger.x <= 1200 &&
        thumbFinger.y >= 0 && thumbFinger.y <= 600
    ) {
        //console.log("Dentro");
        let tangFingers = distanceTwoVectors(indexFinger, thumbFinger);
        //console.log(tangFingers);
        mapScale(tangFingers);

    }
}


function mapScale(dist) {
    let newScale = map(dist, 300, 14, 2, 0.5);
    scaleF = newScale;
}

