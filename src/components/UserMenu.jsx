import classnames from "classnames"
import React, { useContext, useState } from "react"
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter"
import { SceneContext } from "../context/SceneContext"
import { combine } from "../library/merge-geometry"
import { getAvatarData } from "../library/utils"
import VRMExporter from "../library/VRMExporter"
import CustomButton from "./custom-button"

import styles from "./UserMenu.module.css"

export const UserMenu = () => {
  const type = "_Gen1" // class type

  const [showDownloadOptions, setShowDownloadOptions] = useState(false)

  const { skinColor, model, avatar } = useContext(SceneContext)

  const handleDownload = () => {
    showDownloadOptions
      ? setShowDownloadOptions(false)
      : setShowDownloadOptions(true)
  }

  async function download(
    avatarToDownload,
    fileName,
    format,
    atlasSize = 4096,
  ) {
    // We can use SaveAs() from file-saver, but as I reviewed a few solutions for saving files,
    // this approach is more cross browser/version tested then other solutions and doesn't require a plugin.
    const link = document.createElement("a")
    link.style.display = "none"
    document.body.appendChild(link)
    function save(blob, filename) {
      link.href = URL.createObjectURL(blob)
      link.download = filename
      link.click()
    }

    function saveString(text, filename) {
      save(new Blob([text], { type: "text/plain" }), filename)
    }

    function saveArrayBuffer(buffer, filename) {
      save(getArrayBuffer(buffer), filename)
    }
    // Specifying the name of the downloadable model
    const downloadFileName = `${
      fileName && fileName !== "" ? fileName : "AvatarCreatorModel"
    }`

    console.log("avatarToDownload", avatarToDownload)

    const avatarToCombine = avatarToDownload.clone()

    const exporter = format === "glb" ? new GLTFExporter() : new VRMExporter()
    const avatarModel = await combine({
      transparentColor: skinColor,
      avatar: avatarToCombine,
      atlasSize,
    })
    if (format === "glb") {
      exporter.parse(
        avatarModel,
        (result) => {
          if (result instanceof ArrayBuffer) {
            saveArrayBuffer(result, `${downloadFileName}.glb`)
          } else {
            const output = JSON.stringify(result, null, 2)
            saveString(output, `${downloadFileName}.gltf`)
          }
        },
        (error) => {
          console.error("Error parsing", error)
        },
        {
          trs: false,
          onlyVisible: false,
          truncateDrawRange: true,
          binary: true,
          forcePowerOfTwoTextures: false,
          maxTextureSize: 1024 || Infinity,
        },
      )
    } else {
      const vrmData = {
        ...getVRMBaseData(avatar),
        ...getAvatarData(avatarModel, "UpstreetAvatar"),
      }
      exporter.parse(vrmData, avatarModel, (vrm) => {
        saveArrayBuffer(vrm, `${downloadFileName}.vrm`)
      })
    }
  }

  function getVRMBaseData(avatar) {
    // to do, merge data from all vrms, not to get only the first one
    for (const prop in avatar) {
      if (avatar[prop].vrm) {
        return avatar[prop].vrm
      }
    }
  }

  function getArrayBuffer(buffer) {
    return new Blob([buffer], { type: "application/octet-stream" })
  }

  return (
    <div className={classnames(styles.userBoxWrap)}>
      <div className={styles.leftCorner} />
      <div className={styles.rightCorner} />
      <ul>
        <React.Fragment>
          <li>
            <CustomButton
              type="icon"
              theme="light"
              icon={showDownloadOptions ? "close" : "download"}
              size={32}
              onClick={handleDownload}
            />
            {showDownloadOptions && (
              <div className={styles.dropDown}>
                <CustomButton
                  theme="light"
                  text="Download GLB"
                  icon="download"
                  size={14}
                  onClick={() => {
                    download(model, `UpstreetAvatar_${type}`, "glb")
                  }}
                />
                <CustomButton
                  theme="light"
                  text="Download VRM"
                  icon="download"
                  size={14}
                  onClick={() => {
                    download(model, `UpstreetAvatar_${type}`, "vrm")
                  }}
                />
              </div>
            )}
          </li>
        </React.Fragment>
      </ul>
    </div>
  )
}
