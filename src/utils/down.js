/**
 * 获取文件流 or Url链接后下载
 */
export function downloadFileStream(res, url, names, callback) {
  let blob,
    downloadElement,
    href = null;
  if (res) {
    blob = new Blob([res.data]);
    downloadElement = document.createElement("a");
    href = window.URL.createObjectURL(blob);
  } else if (url) {
    downloadElement = document.createElement("a");
    href = url;
  }
  downloadElement.href = href;
  downloadElement.download = names;
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(href);
  callback(true);
}

export function downloadBlobStream(blob, names, callback) {
  let downloadElement,
    href = null;
  downloadElement = document.createElement("a");
  href = window.URL.createObjectURL(blob);
  downloadElement.href = href;
  downloadElement.download = names;
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(href);
  callback(true);
}

export function downLoadBlob(data, filename = "导入模板") {
  const blob = new Blob([data], { type: "application/vnd.ms-excel" });
  if (window.navigator && window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(blob, `${filename}.xls`);
  } else {
    // 其他浏览器
    const link = document.createElement("a"); // 创建a标签
    link.style.display = "none";
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    link.download = `${filename}.xls`;
    link.click();
    URL.revokeObjectURL(objectUrl);
    link.remove();
  }
}
