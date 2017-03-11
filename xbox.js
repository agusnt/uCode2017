var xbox = require('xbox-controller-node');


xbox.on('a', function () {
    console.log('[A] button press');
});

xbox.on('b', function () {
    console.log('[B] button press');
});

xbox.on('y', function () {
    console.log('[Y] button press');
});

xbox.on('x', function () {
    console.log('[X] button press');
});

xbox.on('rb', function () {
    console.log('[RB] button press');
});

xbox.on('lb', function () {
    console.log('[LB] button press');
});

xbox.on('start', function () {
    console.log('[Start] button press');
});

//This event is only avaliable on linux
xbox.on('xboxButton', function () {
    console.log('[Xbox] button press');
});

xbox.on('back', function () {
    console.log('[Back] button press');
});

xbox.on('up', function () {
    console.log('[UP] button press');
});

xbox.on('down', function () {
    console.log('[DOWN] button press');
});

xbox.on('left', function () {
    console.log('[LEFT] button press');
});

xbox.on('right', function () {
    console.log('[RIGHT] button press');
});

xbox.on('upright', function () {
    console.log('[UPRIGHT] buttons combination press');
});

xbox.on('upleft', function () {
    console.log('[UPLEFT] buttons combination press');
});

xbox.on('downright', function () {
    console.log('[DOWNRIGHT] buttons combination press');
});

xbox.on('downleft', function () {
    console.log('[DOWNLEFT] buttons combination press');
});

xbox.on('leftstickpress', function () {
    console.log('[LEFTSTICK] button press');
});

xbox.on('rightstickpress', function () {
    console.log('[RIGHTSTICK] button press');
});

/* Stick events */

xbox.on('leftstickLeft', function () {
    console.log('Moving [LEFTSTICK] LEFT');
});

xbox.on('leftstickRight', function () {
    console.log('Moving [LEFTSTICK] RIGHT');
});

xbox.on('leftstickDown', function () {
    console.log('Moving [LEFTSTICK] DOWN');
});

xbox.on('leftstickUp', function () {
    console.log('Moving [LEFTSTICK] UP');
});


xbox.on('rightstickLeft', function () {
    console.log('Moving [RIGHTSTICK] LEFT');
});

xbox.on('rightstickRight', function () {
    console.log('Moving [RIGHTSTICK] RIGHT');
});

xbox.on('rightstickDown', function () {
    console.log('Moving [RIGHTSTICK] DOWN');
});

xbox.on('rightstickUp', function () {
    console.log('Moving [RIGHTSTICK] UP');
});


