exports.flip = function(arg, user, room) {
    let res = (Math.round(Math.random()) == 1) ? 'Heads' : 'Tails';
    room.send(user.username + ' has flipped a ' + res + '!');
}