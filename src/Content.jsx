import React from "react"
import HeroPhotoA from "./img/HeroA.svg"
import HeroPhotoB from "./img/HeroB.svg"
import Style from "./css/content.module.css"
import Cropper from 'react-easy-crop'
import { getCroppedImg, getRotatedImage } from './canvasUtils'
import { getOrientation } from 'get-orientation/browser'
import Lottie from 'react-lottie';
import AnimationLoading from "./loadingWithpleasewait"

export default function Content(){

    const [imageSrc, setImageSrc] = React.useState(null)
    const [crop, setCrop] = React.useState({ x: 0, y: 0 })
    const [rotation, setRotation] = React.useState(0)
    const [zoom, setZoom] = React.useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null)
    const [croppedImage, setCroppedImage] = React.useState(null)
    const [isUploading, setIsUploading] = React.useState(false)
    const [isUploadFinsih, setuploadFinsih] = React.useState(false)
    const [isUploadError, setupLoadError] = React.useState(false)
    const [randomCode,setRandomCode] = React.useState(0)
    //Generate a random code number (for example, between 1000 and 9999)

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: AnimationLoading,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
      };
    


    const ORIENTATION_TO_ANGLE = {
        '3': 180,
        '6': 90,
        '8': -90,
      }
      
      const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
      }

    function readFile(file) {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.addEventListener('load', () => resolve(reader.result), false)
          reader.readAsDataURL(file)
        })
      }

    async function uploadImage(){
         
         setIsUploading(true)

       

         const ranNumber = Math.floor(1000 + Math.random() * 9000)
         setRandomCode(ranNumber)

         //Create FormData and append the cropped image blob
         const formData = new FormData()

         //Converting Blob image into Object
         const response = await fetch(croppedImage);
         const croppedImageBlob = await response.blob();

         //Creating Form Data
         formData.append('image', croppedImageBlob)
         formData.append('code', ranNumber)
         
         try{

            const response = await fetch('https://cluster-clear.com/unattended_UploadNPrint/upload.php', {
                method: 'POST',
                body: formData,
              })

            const result = await response.json()
            
         
            setupLoadError(true)
   

         }catch(e){

            setuploadFinsih(true)
          

         }

    }

    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0]
          let imageDataUrl = await readFile(file)
    
          try {
            // apply rotation if needed
            const orientation = await getOrientation(file)
            const rotation = ORIENTATION_TO_ANGLE[orientation]
            if (rotation) {
              imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
            }
          } catch (e) {
            console.warn('failed to detect the orientation')
          }
    
          setImageSrc(imageDataUrl)
        }
      }

    const showCroppedImage = async () => {

        try {

          const croppedImage = await getCroppedImg(
            imageSrc,
            croppedAreaPixels,
            rotation
          )

          setCroppedImage(croppedImage)

        } catch (e) {
          console.error(e)
        }

      }
     
    const LandingContent = () => {
        return (
            <div className={Style.uploadphotocontainer}>
                <h2>UPLOAD & PRINT</h2>
                <img src={HeroPhotoA} className={Style.TopHeroimg} />

                <div>
                    <input type="File" id="btnUpload" onChange={onFileChange} accept="image/jpeg" hidden/>
                    <label for="btnUpload" className={Style.uploadbutton}>Choose File</label>
                </div>

                <img src={HeroPhotoB} className={Style.bottomHeroimg}/>

                
            </div>
        )
      } 

   
    if(isUploadFinsih){
        return ( 

            <div className={Style.CodeContainer}>
                <h2>YOUR CODE</h2>
                <div className={Style.Code}>
                    <label>{randomCode}</label>
                </div>
                <div className={Style.PrintInstruction}>
                    <p>INSTRUCTION</p>
                    <ol>
                        <li>Go to our nearest CCE Photo Booth</li>
                        <li>Select your prefered language</li>
                        <li>Tap on Print My Photo</li>
                        <li>Type the above to print your photo</li>
                    </ol>
                </div>
                <div>
                    <div className={Style.LocatePhotobooth}>
                        <label>Nearest Photo Booth</label>
                    </div>
                </div>
            </div>

        )
    }

    if(isUploadError){
        return (<h1>Oooo...</h1>)
    }

    if(isUploading){
        return(
            <div className={Style.LoadingContainer}>

                    <Lottie 
                    options={defaultOptions}
                    height={400}
                    width={400}
                    />
                
                
          </div>
        )
    }

    if(imageSrc != null){

        if(croppedImage != null){
            return(
                <div className={Style.finalImageContainer}>
                    <p>Your Printed photo will look like this</p>
                    <img src={croppedImage} /> 
                    <div className={Style.uploadButton} onClick={uploadImage} >
                        <label>Upload</label>
                    </div>
              </div> 
            )
        }else{
            return (
                <div className={Style.CropNUploadFileContainer}>
                    
                    <div className={Style.instruction}>
                    <p>Adjust your photo based on the grid size, as this represents the print size.</p>
                    </div>
    
                    <div className={Style.cropContainer}>
                        <Cropper
                        image={imageSrc}
                        crop={crop}
                        rotation={rotation}
                        zoom={zoom}
                        aspect={3 / 2}
                        onCropChange={setCrop}
                        onRotationChange={setRotation}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        
                        />
                    </div>
    
                    <div className={Style.uploadButton} onClick={showCroppedImage}>
                        <label>Proceed</label>
                    </div>
    
                </div> 
            )
        }

    }else{
        return(<LandingContent />)
    }







}