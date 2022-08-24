document.addEventListener("DOMContentLoaded", () => {
  const checkTextArea = document.getElementById("value");
  const infoTextArea = document.getElementById("info");
  const sendButton = document.getElementById("send");
  const openButton = document.getElementById("open");
  let hasOriginalText = false;
  let wordsCounter = false;

  const regExp = /[^(\d+(.\d+)?)]/g;

  const EMPTY_STRING = "";
  const MIN_WORDS_COUNT = 3;
  const MAX_PERCENTAGE = 100;
  const SEND_BTN_TITLE = `Enter at least ${MIN_WORDS_COUNT} words and download original text!`;

  infoTextArea.disabled = true;
  sendButton.disabled = true;
  sendButton.title = SEND_BTN_TITLE;

  checkTextArea.addEventListener("keyup", (e) => {
    const wordsArray = e.target.value
      .split(" ")
      .filter((str) => str.length > 0);
    wordsCounter = wordsArray.length >= MIN_WORDS_COUNT;
    if (wordsCounter && hasOriginalText) {
      sendButton.disabled = false;
      sendButton.title = EMPTY_STRING;

      if (e.code === "Enter") {
        sendButton.disabled = false;
        sendButton.title = EMPTY_STRING;
        sendButton.click();
      }
    } else {
      sendButton.disabled = true;
      sendButton.title = SEND_BTN_TITLE;
    }
  });

  sendButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const payload = "name=" + encodeURIComponent(checkTextArea.value);
    try {
      const response = await fetch(
        `${window.location.origin}/cgi-bin/script.cgi`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: payload,
        }
      );
      const text = await response.text();

      const answerNumber = MAX_PERCENTAGE - parseInt(text.replace(regExp, EMPTY_STRING));
      document.querySelector("#opacity").classList.add("opacity");
      document.querySelector("#result").innerHTML = `${answerNumber}% unique`;
    } catch (e) {
      throw new Error(e.message);
    }
  });

  openButton.addEventListener("click", async (event) => {
    event.preventDefault();
    infoTextArea.innerText = EMPTY_STRING;
    try {
      const response = await fetch(
        `${window.location.origin}/cgi-bin/text.cgi`
      );
      const text = await response.text();
      hasOriginalText = true;
      
      infoTextArea.innerHTML = text;
      document.querySelector("#opacity").classList.remove("opacity");
      document.querySelector("#result").innerHTML = "";

      if (wordsCounter && hasOriginalText) {
        sendButton.disabled = false;
        sendButton.title = EMPTY_STRING;
      }  
    } catch (e) {
      throw new Error(e.message);
    }
  });
});
