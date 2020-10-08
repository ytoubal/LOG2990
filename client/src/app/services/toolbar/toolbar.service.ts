import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { Tool } from '@app/classes/tool/tool';
import { KeyShortcut } from '@app/enums/key-shortcuts.enum';
import { ColorPickerService } from '@app/services/color-picker/color-picker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BrushService } from '@app/services/tools/brush/brush.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';
import { EraseService } from '@app/services/tools/erase/erase.service';
import { EyedropperService } from '@app/services/tools/eyedropper/eyedropper.service';
import { LineService } from '@app/services/tools/line/line.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';

export enum toolsIndex {
    pencil,
    brush,
    rectangle,
    ellipse,
    lines,
    eraser,
    eyedropper,
}

@Injectable({
    providedIn: 'root',
})
export class ToolbarService {
    private tools: Tool[];
    currentTool: Tool;
    primaryColor: Color;
    secondaryColor: Color;
    keyShortcuts: Map<string, Tool> = new Map();

    constructor(
        protected pencilService: PencilService,
        protected brushService: BrushService,
        protected rectangleService: RectangleService,
        protected ellipseService: EllipseService,
        protected lineService: LineService,
        protected eraseService: EraseService,
        protected eyedropperService: EyedropperService,
        protected drawingService: DrawingService,
        protected colorPickerService: ColorPickerService,
    ) {
        this.tools = [pencilService, brushService, rectangleService, ellipseService, lineService, eraseService, eyedropperService];
        this.currentTool = this.tools[0];
        this.keyShortcuts
            .set(KeyShortcut.Pencil, pencilService)
            .set(KeyShortcut.Brush, brushService)
            .set(KeyShortcut.Rectangle, rectangleService)
            .set(KeyShortcut.Ellipse, ellipseService)
            .set(KeyShortcut.Line, lineService)
            .set(KeyShortcut.Eraser, eraseService)
            .set(KeyShortcut.Eyedropper, eyedropperService);
    }

    initializeColors(): void {
        this.colorPickerService.primaryColor.subscribe((color: Color) => {
            this.setColors(color, this.secondaryColor);
        });

        this.colorPickerService.secondaryColor.subscribe((color: Color) => {
            this.setColors(this.primaryColor, color);
        });
    }

    getTools(): Tool[] {
        return this.tools;
    }

    getTool(keyShortcut: string): Tool | undefined {
        let tool: Tool | undefined;
        if (this.keyShortcuts.has(keyShortcut)) {
            tool = this.keyShortcuts.get(keyShortcut);
        }
        return tool;
    }

    setColors(primaryColor: Color, secondaryColor: Color): void {
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.applyCurrentToolColor();
    }

    applyCurrentTool(): void {
        this.currentTool.resetContext();
        this.applyCurrentToolColor();
    }

    onKeyDown(event: KeyboardEvent): void {
        this.currentTool.onKeyDown(event);
        const toolFound = this.getTool(event.key);
        const isNewTool = toolFound && toolFound !== this.currentTool;
        this.currentTool = toolFound ? toolFound : this.currentTool;
        if (isNewTool) {
            this.applyCurrentTool();
        }
    }

    onKeyPress(event: KeyboardEvent): void {
        this.currentTool.onKeyPress(event);
    }

    onKeyUp(event: KeyboardEvent): void {
        this.currentTool.onKeyUp(event);
    }

    onMouseMove(event: MouseEvent): void {
        this.currentTool.onMouseMove(event);
    }

    onMouseDown(event: MouseEvent): void {
        this.currentTool.onMouseDown(event);
    }

    onMouseUp(event: MouseEvent): void {
        this.currentTool.onMouseUp(event);
    }

    onMouseEnter(event: MouseEvent): void {
        this.currentTool.onMouseEnter(event);
    }

    onMouseLeave(event: MouseEvent): void {
        this.currentTool.onMouseLeave(event);
    }

    onDoubleClick(event: MouseEvent): void {
        this.currentTool.onDoubleClick(event);
    }

    onClick(event: MouseEvent): void {
        this.currentTool.onClick(event);
    }

    private applyCurrentToolColor(): void {
        this.currentTool.setColors(this.primaryColor, this.secondaryColor);
    }
}
