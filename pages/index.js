import Head from 'next/head'
import { useState } from 'react'
import ClassAccordion from '../components/ClassAccordion'
import Uploads from '../components/Uploads'
import Downloads from '../components/Downloads'
import { Row, Col, Container, Button, Form } from 'react-bootstrap'

export default function Home() {
  const [data, setData] = useState([])
  const [viewer, setViewer] = useState("")
  const [editor, setEditor] = useState("")

  const handleUpload = (newData) => {
    setData(newData)
    console.log(newData)
  }

  const handleCopyClipboard = (e, text) => {
    e.preventDefault()
    navigator.clipboard.writeText(text)
  }
  return (
    <div>
      <Head>
        <title>Moduloose - Communication Modules</title>
        <meta name="description" content="Moduloose Communication Modules App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="main">
        <Row className="m-0">
          <Col id="selectors" className="selector-column" sm={3}>
            <h1 className="px-2 mb-0">Modul<span className="text-danger">oo</span>se</h1>
            {(data.length > 0) && data.map(clss =>
              <ClassAccordion key={clss.id} clss={clss} exportSelect={(mod) => { setViewer(mod.value) }} />
            )}
            <Uploads exportUpload={handleUpload} />
            <Downloads jsonData={data} />
          </Col>
          <Col id="editors" sm={9}>
            <Container>
              <Form>
                <Form.Label as="h3" className="my-2">Module Viewer</Form.Label>
                <Form.Control as="textarea" rows={7} placeholder={"Select a module on and visualize it here."} value={viewer} onChange={(e) => setViewer(e.target.value)} />
                <Button className="text-center mt-2 w-100" onClick={(e) => handleCopyClipboard(e, viewer)} variant="secondary"> Copy Viewer </Button>
                <Form.Label as="h3" className="my-2">Editor</Form.Label>
                <Form.Control as="textarea" rows={12} style={{ minHeight: "40vh" }} placeholder={"Use this editor for module adjustments and compositions."} value={editor} onChange={(e) => setEditor(e.target.value)} />
                <Button className="text-center mt-2 w-100" onClick={(e) => handleCopyClipboard(e, editor)} variant="secondary"> Copy Editor</Button>
              </Form>
            </Container>
          </Col>
        </Row>
      </main>

    </div >
  )
}


