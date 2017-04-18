String.prototype.sanitize = function() {
    let entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };

    let escapeHtml = function (string) {
      return string.replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
        return entityMap[s];
      });
    };
    return escapeHtml(this);
};

class App {

  constructor () {
    this.server = 'http://127.0.0.1:3000/classes/messages';
    this.friends = new Set();
    this.rooms = new Set();
    this.init();
  }

  init () {
    let app = this;

    $(document).ready(function() {
      $('#chats').off('click', '.username')
        .on('click', '.username', app.handleUsernameClick.bind(app));

      $('#send').submit(function(event) {
        event.preventDefault();
        app.handleSubmit();
      });
      app.fetch(); //'order': '-createdAt'
      setInterval(function() {
        app.fetch();
      }, 5000);
    });
  }

  send (message) {
    $.ajax({
      url: this.server,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(message),
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch () {
    let app = this;
    $.ajax({
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        app.clearMessages();
        for (let i = 0; i < data.results.length; i++) {
          if (data.results[i].roomname){
            app.rooms.add(data.results[i].roomname.sanitize());
          }
          let message = new Message(data.results[i].username, data.results[i].message, data.results[i].roomname);
          app.renderMessage(message);
        }
        app.rooms.forEach(function(room) {
          $('#roomSelect').append($('<option>', { 
            value: room,
            text: room
          }));
        });
        console.log('chatterbox: Message received');
      },
      error: function (data) {
        console.error('chatterbox: Failed to receive message', data);
      }
    }); 
  }

  clearMessages () {
    $('#chats').children().remove();
  }

  renderMessage (message) {
    $('#chats').append('<p class="username">' + message.username + ': ' + message.message + '</p>');
  }

  renderRoom (roomname) {
    $('#roomSelect').append('<h1>awesomeRoom</h1>');
  }

  handleUsernameClick (username) {
    this.friends.add(username);
  }

  handleSubmit () {
    var username = window.location.search.slice(10);
    var newMessage = new Message(username, $('#message').val(), '#chats');
    this.send(newMessage);
    app.fetch({'order': '-createdAt'});
  }

  
}

let Message = class Message {
  constructor(username, text, roomname) {
    this.username = username ? String(username).sanitize() : '';
    this.message = text ? String(text).sanitize() : '';
    this.roomname = roomname ? String(roomname).sanitize() : '';
  }
};

let app = new App();


