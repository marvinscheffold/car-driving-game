import { Line } from "./line.js";
import { Point } from "./point.js";

export class Rectangle {
    /*
     * Takes center as Point and rotation in degrees
     */
    constructor(center, width = 1, height = 1, rotation = 0) {
        this.center = center;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
        // Original corners before rotation
        this.originalA = new Point(center.x - width / 2, center.y - height / 2);
        this.originalB = new Point(center.x + width / 2, center.y - height / 2);
        this.originalC = new Point(center.x + width / 2, center.y + height / 2);
        this.originalD = new Point(center.x - width / 2, center.y + height / 2);
        // Actual rotated corners
        this.A = this.originalA.rotate(this.center, rotation);
        this.B = this.originalB.rotate(this.center, rotation);
        this.C = this.originalC.rotate(this.center, rotation);
        this.D = this.originalD.rotate(this.center, rotation);
        // Lines connecting actual corners
        this.a = new Line(this.A, this.B);
        this.b = new Line(this.B, this.C);
        this.c = new Line(this.C, this.D);
        this.d = new Line(this.D, this.A);
    }

    getSides() {
        return [this.a, this.b, this.c, this.d];
    }
}
