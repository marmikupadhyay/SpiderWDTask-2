window.addEventListener("DOMContentLoaded", event => {
  richTextField.document.designMode = "On";
  var frames = window.frames;
  for (var i = 0; i < frames.length; i++) {
    frames[i].document.designMode = "On";
  }

  document.querySelectorAll(".submit").forEach(btn => {
    btn.onclick = submit_form;
  });
  document.querySelectorAll(".bold").forEach(btn => {
    btn.onclick = iBold;
  });
  document.querySelectorAll(".italic").forEach(btn => {
    btn.onclick = iItalic;
  });
  document.querySelectorAll(".underline").forEach(btn => {
    btn.onclick = iUnderline;
  });
  document.querySelectorAll(".link").forEach(btn => {
    btn.onclick = iLink;
  });
  document.querySelectorAll(".unlink").forEach(btn => {
    btn.onclick = iUnLink;
  });
  document.querySelectorAll(".insimg").forEach(btn => {
    btn.onclick = iImage;
  });

  function iFrameOn() {
    richTextField.document.designMode = "On";
  }
  function submit_form() {
    var theForm = document.getElementById("myform");
    theForm.elements["body"].value =
      window.frames["richTextField"].document.body.innerHTML;
    theForm.submit();
  }
  function iBold() {
    for (var i = 0; i < frames.length; i++) {
      frames[i].document.execCommand("bold", false, null);
    }
  }
  function iUnderline() {
    for (var i = 0; i < frames.length; i++) {
      frames[i].document.execCommand("underline", false, null);
    }
  }
  function iItalic() {
    for (var i = 0; i < frames.length; i++) {
      frames[i].document.execCommand("italic", false, null);
    }
  }
  function iLink() {
    var linkURL = prompt("Enter the URL for this link:", "http://");
    for (var i = 0; i < frames.length; i++) {
      frames[i].document.execCommand("CreateLink", false, linkURL);
    }
  }
  function iUnLink() {
    for (var i = 0; i < frames.length; i++) {
      frames[i].document.execCommand("unlink", false, null);
    }
  }
  function iImage() {
    var imgSrc = prompt("Enter image location", "");
    if (imgSrc != null) {
      for (var i = 0; i < frames.length; i++) {
        frames[i].document.execCommand("insertimage", false, imgSrc);
      }
    }
  }
});
