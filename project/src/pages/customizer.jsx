/* eslint-disable no-unused-vars */
import React,{useState,useEffect} from 'react'
import { AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { motion } from 'framer-motion'
import state from '../store/Proxy'
import {download, stylishShirt} from '../assets/index'
import {downloadCanvasToImage,reader} from '../config/helpers'
import {EditorTabs,FilterTabs,DecalTypes} from '../config/constants'
import { fadeAnimation,slideAnimation } from '../config/motion'
import {CustomButton,AiPicker,FilePicker,Tab,ColorPicker} from '../components'
const Customizer = () => {
  const snap = useSnapshot(state);
  const [file ,setFile]=useState('')
  const [prompt,setPrompt]=useState('')
  const [generateingImg,setGeneratingImg]=useState(false);
  const [activeEditorTab,setActiveEditorTab]=useState('')
  const [activeFilterTab,setActiveFilterTab]=useState({
    logoShirt:true,
    stylishShirt:false,
  })

  const generateTabContent =()=>{
    switch (activeEditorTab) {
      case "colorpicker":
       return<ColorPicker/>
      case "aipicker":
       return <AiPicker 
       />
      case "filepicker":
        return <FilePicker
        file={file}
        setFile={setFile}
        readFile={readFile}
      />
      default:
       return null;
    }
  }
  const handleDecals =(type,result)=>{
    const decalType =DecalTypes[type];
    state[decalType.stateProperty] =result;
    if(!activeFilterTab[decalType.filterTab]){
      handleActiveFilterTab(decalType.filterTab)
    }
  }
  const handleActiveFilterTab =(tabName)=>{
    switch (tabName) {
      case 'logoShirt':
        state.isLogoTexture=!activeFilterTab[tabName];
        break;
      case 'stylishShirt':
        state.isFullTexture=!activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture =true;
        state.isFullTexture =false;  
        break;
    }
    setActiveFilterTab({
      ...activeFilterTab,
      [tabName]:!activeFilterTab[tabName]
    })
  }
  const readFile =(type)=>{
    reader(file)
    .then((result)=>{
      handleDecals(type,result);
      setActiveEditorTab('');
    })
  }
  const handleSaveImage =()=>{
    setGeneratingImg(true);
    setTimeout(()=>{
      downloadCanvasToImage('canvas','custom-shirt.png')
      setGeneratingImg(false)
    },1000)
  }
  const checkFunction = () => {
    return file !== "" || snap.color !== "#EFBD48";
  }
  return (
   <AnimatePresence>
       {!snap.intro && (
        <>
        <motion.div key='custom'
        className='absolute top-0 left-0 z-10'{
          ...slideAnimation('left')
        }
        >
          <div className="flex items-center min-h-screen">
            <div className="editortabs-container tabs">
              {EditorTabs.map((tab)=>(
                <Tab
                key={tab.name}
                tab ={tab}
                handleClick={()=> setActiveEditorTab(tab.name)}
                />
              ))}
              {generateTabContent()}
            </div>
          </div>

        </motion.div>
        <motion.div
        className='absolute z-10 top-5 right-5 '{...fadeAnimation}
        >
          <CustomButton
          type="filled"
          title="GO Back"
          handleClick={()=>{
            state.intro=true
            setFile('')
            setActiveEditorTab('')
            setPrompt('')
            state.logoDecal='./threejs.png';
            state.fullDecal='./threejs.png';
            state.isFullTexture= false;
            state.isLogoTexture=true
          }}
          customStyles="w-fit px-4 py-2.5 font-bold text-sm"
          />
            {/* (file === "" || state.color === "#EFBD48") */}
            {checkFunction() && (
              <CustomButton
                type="filled"
                title="Save Image"
                handleClick={handleSaveImage}
                customStyles="w-fit px-4 py-2.5 font-bold text-sm mt-2"
              />
            )}          

        </motion.div>
        <motion.div
        className='filtertabs-container'{...slideAnimation('up')}
        >
          {FilterTabs.map((tab)=>(
            <Tab
            key={tab.name}
            tab={tab}
            isFilterTab
            isActiveTab={activeFilterTab[tab.name]}
            handleClick={()=> handleActiveFilterTab(tab.name)}
            />
          ))}
          
        </motion.div>
        </>
       )}
   </AnimatePresence>
  )
}

export default Customizer