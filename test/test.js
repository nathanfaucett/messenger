var assert = require("assert"),
    Messenger = require("../src/index");


describe("Messenger(adaptor)", function() {
    it("should create Messenger using adaptor's postMessage and addMessageListener", function() {
        var socket = createTwoWaySocket(),
            client = new Messenger(socket.client),
            server = new Messenger(socket.server);

        server.on("message", function(data, callback) {
            callback(undefined, data);
        });

        client.emit("message", {
            data: "data"
        }, function(error, data) {
            assert.equal(error, undefined);
            assert.deepEqual(data, {
                data: "data"
            });
        });

        client.on("message", function(data, callback) {
            callback(undefined, data);
        });

        server.emit("message", {
            data: "data"
        }, function(error, data) {
            assert.equal(error, undefined);
            assert.deepEqual(data, {
                data: "data"
            });
        });
    });
});

function createTwoWaySocket() {
    var client = new Socket(),
        server = new Socket();

    client.socket = server;
    server.socket = client;

    return {
        client: client,
        server: server
    };
}

function Socket() {
    this.socket = null;
    this.onMessage = null;
}

Socket.prototype.addMessageListener = function(callback) {
    this.onMessage = callback;
};

Socket.prototype.postMessage = function(data) {
    this.socket.onMessage(data);
};
