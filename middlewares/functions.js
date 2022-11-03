module.exports = function statusClick(req, res) {
  let state = req.app.statusBtn;
  res.send(
    (document.getElementById("selectStatus").innerHTML = e.target.value)
  );
};
