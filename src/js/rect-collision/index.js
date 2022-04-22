import { Point } from "./point.js";
import { Rectangle } from "./rectangle.js";

export function areRectanglesOverlapping(rectData1, rectData2) {
    const {
        cx: cx1,
        cy: cy1,
        width: width1,
        height: height1,
        rotation: rotation1,
    } = rectData1;

    const {
        cx: cx2,
        cy: cy2,
        width: width2,
        height: height2,
        rotation: rotation2,
    } = rectData2;

    const rect1 = new Rectangle(
        new Point(cx1, cy1),
        width1,
        height1,
        rotation1
    );

    const rect2 = new Rectangle(
        new Point(cx2, cy2),
        width2,
        height2,
        rotation2
    );

    const rect1Sides = rect1.getSides();
    const rect2Sides = rect2.getSides();

    return rect1Sides.some((line) => {
        return rect2Sides.some((line2) => {
            const intersection = line.intersect(line2);
            if (
                line.isPointOnLine(intersection) &&
                line2.isPointOnLine(intersection)
            ) {
                console.log("Intersection:", ...intersection.toArray());
                console.log("Line Rect1", line);
                console.log("Line Rect2", line2);
                console.log("Rotation Rect1:", rect1.rotation);
                console.log("Rect1", rect1);
                return true;
            }
            return false;
        });
    });
}
