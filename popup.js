document.getElementById("summarize").addEventListener("click" , () => {
 const resultDiv = document.getElementById("result");
 resultDiv.innerHTML = '<div class="loading"><div class="loader"></div></div>';
 const summaryType = document.getElementById("summary-type").value;


 //get the api key from storage 
 chrome.storage.sync.get(["geminiApiKey"] , async (result) => {
   if(!result.geminiApiKey){
      resultDiv.innerHTML = "API key not found. Please set your API key in the extension options.";
      return;
   }

   chrome.tabs.query({active : true , currentWindow : true} , ([tab]) => {
       chrome.tabs.sendMessage(
         tab.id,
         {type : "GET_ARTICLE_TEXT"},
         async(res) => {
            if(!res || !res.text){
               resultDiv.innerText = "Could not extract article text from this page.";
               return;
            }

            try {
               const summary = await getGeminiSummary(
                  res.text,
                  summaryType,
                  result.geminiApiKey
               );
               resultDiv.innerText = summary;
            } catch(error){
               resultDiv.innerText = `Error: ${
                  error.message || "Failed to generate summary"
               }`;
            }
         }
       )
   })
 })






   result.textContent = "Extracting text....";


   chrome.tabs.query({active : true , currentWindow : true} , ([tab]) => {
      chrome.tabs.sendMessage(
         tab.id,
         {type : "GET_ARTICLE_TEXT"},
         ({text}) => {
           result.textContent = text ? text.slice(0 , 300) + "_" : "No article text found";
         }
      );
   });
});

