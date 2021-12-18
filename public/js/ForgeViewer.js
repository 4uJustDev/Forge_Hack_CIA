var viewer;

function launchViewer(urn) {
  var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken
  };

  Autodesk.Viewing.Initializer(options, () => {
    viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), { extensions: [ 'Autodesk.DocumentBrowser', 'TestExtension', 'HandleSelectionExtension'] });
    viewer.start();
    var documentId = 'urn:' + urn;
    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
  });
}

function onDocumentLoadSuccess(doc) {
  var viewables = doc.getRoot().getDefaultGeometry();
  viewer.loadDocumentNode(doc, viewables).then(i => {
    // documented loaded, any action?
  });
}

function onDocumentLoadFailure(viewerErrorCode) {
  console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function getForgeToken(callback) {
  fetch('/api/forge/oauth/token').then(res => {
    res.json().then(data => {
      callback(data.access_token, data.expires_in);
    });
  });
}

const onExtensionLoaded = (e) => {

  if (e.extensionId === 'Autodesk.BimWalk') {

    const navTools = viewer.toolbar.getControl('navTools')

    navTools.removeControl('toolbar-bimWalkTool')

    viewer.removeEventListener(
      Autodesk.Viewing.EXTENSION_LOADED_EVENT,
      onExtensionLoaded)
  }
}

viewer.addEventListener(
  Autodesk.Viewing.EXTENSION_LOADED_EVENT,
  onExtensionLoaded)

viewer.start()