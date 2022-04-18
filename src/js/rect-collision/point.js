export class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    toArray() {
        return [this.x, this.y];
    }

    rotate(aroundPoint, angle) {
        const radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx =
                cos * (this.x - aroundPoint.x) +
                sin * (this.y - aroundPoint.y) +
                aroundPoint.x,
            ny =
                cos * (this.y - aroundPoint.y) -
                sin * (this.x - aroundPoint.x) +
                aroundPoint.y;
        return new Point(nx, ny);
    }

    distance(point) {
        return Math.hypot(point.x - this.x, point.y - this.y);
    }
}
