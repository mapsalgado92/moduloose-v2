import Head from 'next/head'
import { Fragment, useState } from 'react'
import ClassAccordion from '../components/ClassAccordion'
import Uploads from '../components/Uploads'
import Downloads from '../components/Downloads'
import { Row, Col, Container, Button, Form, Tabs, Tab, InputGroup, DropdownButton, ListGroup } from 'react-bootstrap'
import { Class, Module, Type } from '../classes/dataClasses'

const Admin = () => {
  const [data, setData] = useState([])
  const [selected, setSelected] = useState({
    clss: null,
    type: null,
    module: null
  })

  const [formInfo, setFormInfo] = useState({
    clssName: "",
    typeName: "",
    modName: "",
    modValue: ""
  })

  const handleUpload = (newData) => {
    setData(newData)
    console.log(newData)
  }

  const handleCopyClipboard = (e, text) => {
    e.preventDefault()
    navigator.clipboard.writeText(text)
  }

  const handleChange = (e, field) => {
    setFormInfo({ ...formInfo, [field]: e.target.value })
  }

  const handleSelectMod = (mod) => {
    setSelected({ mod: mod, type: mod.getParent(), clss: mod.getParent().getParent() })
    setFormInfo({ modName: mod.name, modValue: mod.value, typeName: mod.getParent().name, clssName: mod.getParent().getParent().name })
  }

  ////ADD HANDLERS

  const handleAddClass = () => {
    formInfo.clssName && setData([...data, new Class(Date.now(), formInfo.clssName)])
    setFormInfo({ clssName: "", typeName: "", modName: "", modValue: "" })
  }

  const handleAddType = () => {
    let newData = [...data]
    if (selected.clss && formInfo.typeName) {
      newData.forEach((clss, index) => {
        if (clss.name === selected.clss.name) {
          clss.addType(new Type(Date.now(), formInfo.typeName))
        }
        newData[index] = clss
      })
      setFormInfo({ clssName: "", typeName: "", modName: "", modValue: "" })
      setData(newData)
    }
  }

  const handleAddModule = () => {
    let newData = [...data]
    console.log("TYPE: ", selected.type, "FORMINFO: ", formInfo)
    if (selected.type && formInfo.modValue) {
      newData.forEach((clss, index) => {
        if (clss.name === selected.clss.name) {
          console.log("WILL ADD MODULE")
          clss.findType(selected.type.id).addModule(new Module(Date.now(), formInfo.modName, formInfo.modValue))
          newData[index] = clss
        }
      })
      setFormInfo({ clssName: "", typeName: "", modName: "", modValue: "" })
      setData(newData)
    }
  }

  ////EDIT HANDLERS

  const handleEditClass = () => {
    if (formInfo.clssName) {
      let editableClass = selected.clss
      editableClass.name = formInfo.clssName
      let newData = [...data]
      newData.forEach((clss, index) => {
        if (clss.id === selected.clss.id) {
          newData[index] = editableClass
        }
      })
      setSelected({ ...selected, clss: editableClass })
      setFormInfo({ clssName: "", typeName: "", modName: "", modValue: "" })
      setData(newData)
    }
  }

  const handleEditType = () => {
    if (formInfo.typeName && selected.type) {
      let editableClass = selected.clss
      editableClass.findType(selected.type.id).name = formInfo.typeName
      let newData = [...data]
      newData.forEach((clss, index) => {
        if (clss.id === selected.type.getParent().id) {
          newData[index] = editableClass
        }
      })
      setSelected({ ...selected, clss: editableClass, type: editableClass.findType(selected.type.id) })
      setFormInfo({ clssName: "", typeName: "", modName: "", modValue: "" })
      setData(newData)
    }
  }

  const handleEditModule = () => {
    if (formInfo.modName && selected.mod) {
      let editableClass = selected.clss
      editableClass.findType(selected.type.id).findModule(selected.mod.id).name = formInfo.modName
      editableClass.findType(selected.type.id).findModule(selected.mod.id).value = formInfo.modValue
      let newData = [...data]
      newData.forEach((clss, index) => {
        if (clss.id === selected.type.getParent().id) {
          newData[index] = editableClass
        }
      })
      setSelected({ clss: editableClass, type: editableClass.findType(selected.type.id), module: editableClass.findType(selected.type.id).findModule(selected.mod.id) })
      setFormInfo({ clssName: "", typeName: "", modName: "", modValue: "" })
      setData(newData)
    }
  }

  ////REMOVE HANDLERS
  const handleRemoveClass = () => {
    if (selected.clss) {
      let newData = data.filter(clss => clss.id !== selected.clss.id)
      setSelected({
        clss: null,
        type: null,
        mod: null
      })
      setFormInfo({
        clssName: "",
        typeName: "",
        modName: "",
        modValue: ""
      })
      setData(newData)
    }
  }

  const handleRemoveType = () => {
    if (selected.type) {
      let newData = [...data]
      newData.forEach((clss, index) => {
        if (clss.id === selected.clss.id) {
          newData[index] = clss.removeType(selected.type.id)
        }
      })
      setSelected({
        ...selected,
        type: null,
        mod: null
      })
      setFormInfo({
        clssName: "",
        typeName: "",
        modName: "",
        modValue: ""
      })
      setData(newData)
    }
  }

  const handleRemoveModule = () => {
    if (selected.mod) {
      let newData = [...data]
      newData.forEach((clss, index) => {
        console.log(clss, selected.clss.mod)
        if (clss.id === selected.clss.id) {
          console.log("WILL REMOVE")
          clss.findType(selected.type.id).removeModule(selected.mod.id)
        }
      })
      setSelected({
        ...selected,
        mod: null
      })
      setFormInfo({
        clssName: "",
        typeName: "",
        modName: "",
        modValue: ""
      })
      setData(newData)
    }
  }

  return (
    <>
      <Head>
        <title>Moduloose - Admin Page</title>
        <meta name="description" content="Moduloose Communication Modules App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Row>
          <Col id="selectors" sm={3}>
            <h1 className="p-2">Modul<span className="text-danger">oo</span>se Adm<span className="text-danger">i</span>n</h1>
            {(data.length > 0) && data.map(clss =>
              <ClassAccordion key={clss.id} clss={clss} exportSelect={(mod) => handleSelectMod(mod)} />
            )}
            <Uploads exportUpload={handleUpload} />
            <Downloads jsonData={data} />
          </Col>
          <Col id="editors" sm={9}>
            <Container>
              <Tabs defaultActiveKey="new" id="uncontrolled-tab-example">
                <Tab eventKey="new" title="new">
                  <Form>
                    <Form.Label as="h3" className="mt-4">New Class</Form.Label>
                    <InputGroup >
                      <Form.Control
                        placeholder="Class Name"
                        aria-label="Class Name"
                        value={formInfo.clssName}
                        onChange={(e) => handleChange(e, "clssName")}
                      />
                      <InputGroup.Append>
                        <Button variant="outline-success" onClick={handleAddClass}>ADD CLASS</Button>
                      </InputGroup.Append>
                    </InputGroup>
                    <Form.Label as="h3" className="mt-4">New Type</Form.Label>
                    <InputGroup >
                      <InputGroup.Prepend>

                        <DropdownButton title={selected.clss ? "Class: " + selected.clss.name : "Select a Class"} className="me-1" disabled={data.length === 0}>
                          <ListGroup variant="flush">
                            {data && data.map(clss =>
                              <ListGroup.Item key={clss.id} action className="rounded-0 flush" onClick={(e) => { e.preventDefault(); setSelected({ clss }) }}>
                                Class: {clss.name}
                              </ListGroup.Item>)}
                          </ListGroup>
                        </DropdownButton>

                      </InputGroup.Prepend>
                      <Form.Control
                        placeholder="Type Name"
                        aria-label="Type Name"
                        value={formInfo.typeName}
                        onChange={(e) => handleChange(e, "typeName")}
                      />
                      <InputGroup.Append>
                        <Button variant="outline-success" onClick={handleAddType}>ADD TYPE</Button>
                      </InputGroup.Append>
                    </InputGroup>
                    <Form.Label as="h3" className="mt-4">New Module</Form.Label>
                    <InputGroup >
                      <InputGroup.Prepend>
                        <DropdownButton title={selected.clss ? "Class: " + selected.clss.name : "Select a Class"} className="me-1" disabled={data.length === 0}>
                          <ListGroup variant="flush">
                            {data && data.map(clss =>
                              <ListGroup.Item key={clss.id} action className="rounded-0 flush" onClick={(e) => { e.preventDefault(); setSelected({ clss }) }}>
                                Class: {clss.name}
                              </ListGroup.Item>)}
                          </ListGroup>
                        </DropdownButton>
                      </InputGroup.Prepend>
                      <InputGroup.Prepend>
                        <DropdownButton title={selected.type ? "Type: " + selected.type.name : "Select a Type"} className="me-1" disabled={!selected.clss}>
                          <ListGroup variant="flush">
                            {selected.clss && selected.clss.types.map(type =>
                              <ListGroup.Item key={type.id} action className="rounded-0 flush" onClick={(e) => { e.preventDefault(); setSelected({ clss: selected.clss, type }) }}>
                                Type: {type.name}
                              </ListGroup.Item>)}
                          </ListGroup>
                        </DropdownButton>
                      </InputGroup.Prepend>

                      <Form.Control
                        placeholder="Module Name"
                        aria-label="Module Name"
                        value={formInfo.modName}
                        onChange={(e) => handleChange(e, "modName")}
                      />

                    </InputGroup>
                    <Form.Control as="textarea"
                      className="mt-2"
                      rows={10}
                      placeholder="Module Content"
                      value={formInfo.modValue}
                      onChange={(e) => handleChange(e, "modValue")}
                    />
                    <Button variant="outline-success w-100" onClick={handleAddModule}>ADD MODULE</Button>
                  </Form>
                </Tab>
                <Tab eventKey="edit" title="edit">
                  <Form>
                    <Fragment key="edit-class">
                      <Form.Label as="h3" className="mt-4">Edit Class</Form.Label>
                      <InputGroup >
                        <InputGroup.Prepend>
                          <DropdownButton title={selected.clss ? "Class: " + selected.clss.name : "Select a Class"} className="me-1" disabled={data.length === 0}>
                            <ListGroup variant="flush">
                              {data && data.map(clss =>
                                <ListGroup.Item key={clss.id} action className="rounded-0 flush" onClick={(e) => { e.preventDefault(); setSelected({ clss }) }}>
                                  Class: {clss.name}
                                </ListGroup.Item>)}
                            </ListGroup>
                          </DropdownButton>

                        </InputGroup.Prepend>
                        <Form.Control
                          placeholder="Class Name"
                          aria-label="Class Name"
                          value={formInfo.clssName}
                          onChange={(e) => handleChange(e, "clssName")}
                        />
                        <InputGroup.Append>
                          <Button variant="outline-success" onClick={handleEditClass}>EDIT CLASS</Button>
                        </InputGroup.Append>
                      </InputGroup>
                    </Fragment>

                    <Fragment key="edit-type">
                      <Form.Label as="h3" className="mt-4">Edit Type</Form.Label>
                      <InputGroup >
                        <InputGroup.Prepend>
                          <DropdownButton title={selected.clss ? "Class: " + selected.clss.name : "Select a Class"} className="me-1" disabled={data.length === 0}>
                            <ListGroup variant="flush">
                              {data && data.map(clss =>
                                <ListGroup.Item key={clss.id} action className="rounded-0 flush" onClick={(e) => { e.preventDefault(); setSelected({ clss }) }}>
                                  Class: {clss.name}
                                </ListGroup.Item>)}
                            </ListGroup>
                          </DropdownButton>
                        </InputGroup.Prepend>
                        <InputGroup.Prepend>
                          <DropdownButton title={selected.type ? "Type: " + selected.type.name : "Select a Type"} className="me-1" disabled={!selected.clss}>
                            <ListGroup variant="flush">
                              {selected.clss && selected.clss.types.map(type =>
                                <ListGroup.Item key={type.id} action className="rounded-0 flush" onClick={(e) => { e.preventDefault(); setSelected({ clss: selected.clss, type }) }}>
                                  Type: {type.name}
                                </ListGroup.Item>)}
                            </ListGroup>
                          </DropdownButton>
                        </InputGroup.Prepend>

                        <Form.Control
                          placeholder="Type Name"
                          aria-label="Type Name"
                          value={formInfo.typeName}
                          onChange={(e) => handleChange(e, "typeName")}
                        />
                        <InputGroup.Append>
                          <Button variant="outline-success" onClick={handleEditType}>EDIT TYPE</Button>
                        </InputGroup.Append>
                      </InputGroup>
                    </Fragment>
                    <Fragment>
                      <Form.Label as="h3" className="mt-4">Edit Module</Form.Label>
                      <InputGroup >
                        <InputGroup.Prepend>
                          <DropdownButton title={selected.clss ? "Class: " + selected.clss.name : "Select a Class"} className="me-1" disabled={data.length === 0}>
                            <ListGroup variant="flush">
                              {data && data.map(clss =>
                                <ListGroup.Item key={clss.id} action className="rounded-0 flush" onClick={(e) => { e.preventDefault(); setSelected({ clss }) }}>
                                  Class: {clss.name}
                                </ListGroup.Item>)}
                            </ListGroup>
                          </DropdownButton>
                        </InputGroup.Prepend>
                        <InputGroup.Prepend>
                          <DropdownButton title={selected.type ? "Type: " + selected.type.name : "Select a Type"} className="me-1" disabled={!selected.clss}>
                            <ListGroup variant="flush">
                              {selected.clss && selected.clss.types.map(type =>
                                <ListGroup.Item key={type.id} action className="rounded-0 flush" onClick={(e) => { e.preventDefault(); setSelected({ clss: selected.clss, type }) }}>
                                  Type: {type.name}
                                </ListGroup.Item>)}
                            </ListGroup>
                          </DropdownButton>
                        </InputGroup.Prepend>
                        <InputGroup.Prepend>
                          <DropdownButton title={selected.mod ? "Mod: " + selected.mod.name : "Select a Module"} className="me-1" disabled={!selected.type}>
                            <ListGroup variant="flush">
                              {selected.type && selected.type.modules.map(mod =>
                                <ListGroup.Item key={mod.id} action className="rounded-0 flush" onClick={(e) => { e.preventDefault(); setSelected({ ...selected, mod }) }}>
                                  Module: {mod.name}
                                </ListGroup.Item>)}
                            </ListGroup>
                          </DropdownButton>
                        </InputGroup.Prepend>

                        <Form.Control
                          placeholder="Module Name"
                          aria-label="Module Name"
                          value={formInfo.modName}
                          onChange={(e) => handleChange(e, "modName")}
                        />
                      </InputGroup>

                      <Form.Control as="textarea"
                        className="mt-2"
                        rows={10}
                        placeholder="Module Content"
                        value={formInfo.modValue}
                        onChange={(e) => handleChange(e, "modValue")}
                      />
                      <Button variant="outline-success w-100" onClick={handleEditModule}>EDIT MODULE</Button>
                    </Fragment>
                  </Form>
                </Tab>
                <Tab eventKey="remove" title="remove">
                  <Form>
                    <Fragment key="remove-class">
                      <Form.Label as="h3" className="mt-4">Remove Class</Form.Label>
                      <InputGroup >
                        <InputGroup.Prepend>
                          <DropdownButton title={selected.clss ? "Class: " + selected.clss.name : "Select a Class"} className="me-1" disabled={data.length === 0}>
                            <ListGroup variant="flush">
                              {data && data.map(clss =>
                                <ListGroup.Item key={clss.id} action className="rounded-0 flush" onClick={(e) => { e.preventDefault(); setSelected({ clss }) }}>
                                  Class: {clss.name}
                                </ListGroup.Item>)}
                            </ListGroup>
                          </DropdownButton>

                        </InputGroup.Prepend>

                        <InputGroup.Append>
                          <Button variant="danger" onClick={handleRemoveClass}>REMOVE CLASS</Button>
                        </InputGroup.Append>
                      </InputGroup>

                      <Form.Label as="h3" className="mt-4">Remove Type</Form.Label>
                      <InputGroup >
                        <InputGroup.Prepend>
                          <DropdownButton title={selected.clss ? "Class: " + selected.clss.name : "Select a Class"} className="me-1" disabled={data.length === 0}>
                            <ListGroup variant="flush">
                              {data && data.map(clss =>
                                <ListGroup.Item key={clss.id} action className="rounded-0 flush" onClick={(e) => { e.preventDefault(); setSelected({ clss }) }}>
                                  Class: {clss.name}
                                </ListGroup.Item>)}
                            </ListGroup>
                          </DropdownButton>

                        </InputGroup.Prepend>
                        <InputGroup.Prepend>
                          <DropdownButton title={selected.type ? "Type: " + selected.type.name : "Select a Type"} className="me-1" disabled={!selected.clss}>
                            <ListGroup variant="flush">
                              {selected.clss && selected.clss.types.map(type =>
                                <ListGroup.Item key={type.id} action className="rounded-0 flush" onClick={(e) => { e.preventDefault(); setSelected({ clss: selected.clss, type }) }}>
                                  Type: {type.name}
                                </ListGroup.Item>)}
                            </ListGroup>
                          </DropdownButton>
                        </InputGroup.Prepend>

                        <InputGroup.Append>
                          <Button variant="danger" onClick={handleRemoveType}>REMOVE TYPE</Button>
                        </InputGroup.Append>
                      </InputGroup>

                      <Form.Label as="h3" className="mt-4">Remove Module</Form.Label>
                      <InputGroup >
                        <InputGroup.Prepend>
                          <DropdownButton title={selected.clss ? "Class: " + selected.clss.name : "Select a Class"} className="me-1" disabled={data.length === 0}>
                            <ListGroup variant="flush">
                              {data && data.map(clss =>
                                <ListGroup.Item key={clss.id} action className="rounded-0 flush" onClick={(e) => { e.preventDefault(); setSelected({ clss }) }}>
                                  Class: {clss.name}
                                </ListGroup.Item>)}
                            </ListGroup>
                          </DropdownButton>
                        </InputGroup.Prepend>

                        <InputGroup.Prepend>
                          <DropdownButton title={selected.type ? "Type: " + selected.type.name : "Select a Type"} className="me-1" disabled={!selected.clss}>
                            <ListGroup variant="flush">
                              {selected.clss && selected.clss.types.map(type =>
                                <ListGroup.Item key={type.id} action className="rounded-0 flush" onClick={(e) => { e.preventDefault(); setSelected({ clss: selected.clss, type }) }}>
                                  Type: {type.name}
                                </ListGroup.Item>)}
                            </ListGroup>
                          </DropdownButton>
                        </InputGroup.Prepend>

                        <InputGroup.Prepend>
                          <DropdownButton title={selected.mod ? "Mod: " + selected.mod.name : "Select a Module"} className="me-1" disabled={!selected.type}>
                            <ListGroup variant="flush">
                              {selected.type && selected.type.modules.map(mod =>
                                <ListGroup.Item key={mod.id} action className="rounded-0 flush" onClick={(e) => { e.preventDefault(); setSelected({ ...selected, mod }) }}>
                                  Module: {mod.name}
                                </ListGroup.Item>)}
                            </ListGroup>
                          </DropdownButton>
                        </InputGroup.Prepend>
                        <InputGroup.Append>
                          <Button variant="danger" onClick={handleRemoveModule}>REMOVE MODULE</Button>
                        </InputGroup.Append>
                      </InputGroup>
                    </Fragment>
                  </Form>
                </Tab>
              </Tabs>
            </Container>
          </Col>
        </Row>

      </main>
    </>

  )
}

export default Admin
