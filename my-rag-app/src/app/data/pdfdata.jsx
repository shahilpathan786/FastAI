// Upload
const formData = new FormData();
formData.append("file", file);

await fetch("/upload/", {
  method: "POST",
  body: formData
});

// Ask
const res = await fetch("/ask/?query=What is AI?");
const data = await res.json();
console.log(data.answer);