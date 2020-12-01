import { Injectable } from '@angular/core';
import { DEFAULT_ROTATION_ANGLE, STRAIGHT_ANGLE } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class RotateSelectionService {
    angle: number = 0;
    tempCtx: CanvasRenderingContext2D;

    constructor(private drawingService: DrawingService) {}

    scroll(event: WheelEvent, selectionImageData: ImageData): void {
        this.tempCtx = this.drawingService.canvas.getContext('2d') as CanvasRenderingContext2D;
        const tempCanvas = this.tempCtx.canvas;
        const canvas = this.drawingService.previewCtx.canvas;
        const ctx = this.drawingService.previewCtx;

        this.tempCtx.putImageData(selectionImageData, 0, 0);
        this.drawingService.clearCanvas(ctx);

        ctx.save();
        this.angle += (Math.sign(event.deltaY) * (DEFAULT_ROTATION_ANGLE * Math.PI)) / STRAIGHT_ANGLE;
        ctx.beginPath();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(this.angle);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.restore();
        this.tempCtx.drawImage(ctx.canvas, 0, 0);
    }
}
