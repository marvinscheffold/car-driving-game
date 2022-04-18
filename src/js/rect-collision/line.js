import { Point } from "./point.js";

export class Line {
    constructor(point1, point2) {
        this.point1 = point1;
        this.point2 = point2;
    }
    toArray() {
        return [this.point1.toArray(), this.point2.toArray()];
    }
    // Returns Point if lines do intersect or null of they don´t
    intersect(line) {
        const intersection = math.intersect(
            ...this.toArray(),
            ...line.toArray()
        );

        if (!intersection) return null;
        return new Point(...intersection);
    }

    isPointOnLine(point) {
        if (!point) return false;
        if (
            this.point1.distance(point) + this.point2.distance(point) ===
            this.point1.distance(this.point2)
        ) {
            return true;
        }
        return false;
    }
}
