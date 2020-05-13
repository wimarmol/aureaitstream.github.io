const socket = io('https://aureaitstream2020.herokuapp.com/');

$('#chat').hide();

socket.on('MARCELO_LINARES', arrUserInfo => {
    $('#chat').show();
    $('#ini').hide();

    arrUserInfo.forEach(user=>{
        const { ten, peerId } = user;
        $("#ulUser").append(`<li id="${peerId}">${ten}</li>`);
    });
    socket.on('SAMU_MOL', user => {
        const { ten, peerId } = user;
        $("#ulUser").append(`<li id="${peerId}">${ten}</li>`);
    });
    socket.on('QUIEN_ESTA_CONECTADO', peerId => {
        $(`#${peerId}`).remove();
    });
});

socket.on('FRASE_DESCONOCIDA', () => alert('Vui long chon username khac!'));


function openStream(){    
    return navigator.mediaDevices.getUserMedia({ audio : false, video: true });
}

function playStream(idVideoTag, stream){
    const video= document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

openStream()
    .then(
        stream => playStream('localStream',stream)
    );

const peer = new Peer(null, {
    debug: 2
});

peer.on('open', id => { 
    $('#idlabel').append(id);
    $("#btnSignUp").click(()=>{
        const  username = $("#txtUsername").val();
        socket.emit('WILSON_MOLINA', { ten: username, peerId: id });
    });
});

//Caller
$("#btnCall").click(()=>{
    const id=$("#remoteId").val();
    openStream()
    .then(stream =>{
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream',remoteStream));
    });
});

peer.on('call', call => {
    openStream()
    .then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

$('#ulUser').on('click', 'li', function() {
    const id = $(this).attr('id');
    console.log(id);
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

