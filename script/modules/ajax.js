import { setProductsData } from "./config.js";

//ajax

export function ajax(
  mode,
  id,
  name,
  case_ = "",
  glasp = "",
  strap = "",
  picUrl = "",
  gender = "",
  page = "",
) {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    if (this.responseText == "0") setProductsData("");
    else if (mode === "login") {
      // For login, just set the response as is (1 or 0)
      setProductsData(this.responseText);
    } else {
      setProductsData(JSON.parse(this.responseText));
      //   document.write(this.responseText);
    }
  };
  //xhttp.open("GET", `pages/page2.php?mode=${mode}&id=${id}&name=${name}&case_=${case_}&strap=${strap}&glasp=${glasp}&picUrl=${picUrl}&gender=${gender}&page=${page}`, false);
  //xhttp.send();
  //xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhttp.open("POST", "pages/page2.php", false);
  let fd = new FormData();
  fd.append("mode", mode);
  fd.append("id", id);
  fd.append("name", name);
  fd.append("case_", case_);
  fd.append("strap", strap);
  fd.append("glasp", glasp);
  fd.append("picUrl", picUrl);
  fd.append("gender", gender);
  fd.append("page", page);

  xhttp.send(fd);
}
