document.addEventListener('DOMContentLoaded', function () {
    // Setup event handlers for toolbar controls
    document.getElementById('close').addEventListener('click', function(){ window.close(); });
    document.getElementById('minimize').addEventListener('click', function(){ ipc.sendSync('minimize'); });
    document.getElementById('maximize').addEventListener('click', function(){ ipc.sendSync('maximize'); });
});
