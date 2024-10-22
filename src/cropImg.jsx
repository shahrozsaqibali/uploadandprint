import React, { useState } from "react";
import Cropper from "react-easy-crop";  



export default function CropImg(){
    
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)

    
    const onCropComplete = (croppedArea, croppedAreaPixels) => {
      console.log(croppedArea, croppedAreaPixels)
    }


    return (
        <div className="App">
          <div >
            <Cropper
              image="https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000"
              crop={crop}
              zoom={zoom}
              aspect={3 / 2}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          
        </div>
      )
    

}