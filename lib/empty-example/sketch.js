const canvas = (p5) => {
    let img;
    let imgMask;
    p5.preload = function () {
        img = loadImage("../../data/mau1/shadow.png");
        imgMask = loadImage("../../data/mau1/vai.jpg");
    };
    p5.setup = function () {
        p5.createCanvas(700, 400);
    };

    p5.draw = function () {
        image(img, width / 2, height / 2);
    };
};

new p5(canvas);
