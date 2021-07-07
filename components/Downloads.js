import { ListGroup } from "react-bootstrap";


const Downloads = ({ jsonData }) => {
  const exportToJson = () => {
    let filename = "export.json";
    let contentType = "application/json;charset=utf-8;";
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(jsonData)))], { type: contentType });
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      var a = document.createElement('a');
      a.download = filename;
      a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(jsonData));
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
  return (
    <ListGroup.Item variant="primary" action className="rounded-0 w-100" disabled={jsonData.length === 0} onClick={exportToJson} >
      DOWNLOAD
    </ListGroup.Item>
  )
}

export default Downloads
