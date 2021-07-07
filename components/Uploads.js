import { ListGroup } from "react-bootstrap";
import { useRef, Fragment, useState } from "react";
import { Class, Type, Module } from '../classes/dataClasses'

const Uploads = ({ exportUpload }) => {

  const [loaded, setLoaded] = useState(false)
  const [filename, setFilename] = useState("")

  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = e => {
    const fileReader = new FileReader();

    let fullPathSplit = e.target.value.split("\\")
    console.log(fullPathSplit)
    setFilename(fullPathSplit[fullPathSplit.length - 1])

    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      let raw = JSON.parse(e.target.result)

      console.log(raw.length)

      if (raw.lenght !== 0 && raw[0] && raw[0]._typology === "Class") {
        const structuredData = raw.map(clss => {
          let newClass = new Class(clss._id, clss._name)
          if (clss._types) {
            console.log("I GOT HERE")
            clss._types.forEach(type => {
              let newType = new Type(type._id, type._name)
              if (type._modules) {
                type._modules.forEach(mod => {
                  newType.addModule(new Module(mod._id, mod._name, mod._value))
                })
              }
              newClass.addType(newType)
            })
          }

          return newClass
        })

        setLoaded(true)
        exportUpload(structuredData);

      } else {
        console.log("ERROR: INVALID DATA")
      }
    }


  };
  return (
    <Fragment>
      <input ref={hiddenFileInput} type="file" onChange={handleChange} className="d-none" />
      <ListGroup.Item variant={loaded ? "warning" : "dark"} action className="rounded-0 w-100" onClick={handleClick}>UPLOAD FILE  {filename && <span className="text-sm">{`- ${filename}`}</span>}</ListGroup.Item>
    </Fragment>

  );
}

export default Uploads