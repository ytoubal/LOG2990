import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Color } from '@app/classes/color/color';
import { Command } from '@app/classes/commands/command';
import { Tool } from '@app/classes/tool/tool';
import { KeyShortcut } from '@app/enums/key-shortcuts.enum';
import { SelectionType } from '@app/enums/selection-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolbarService } from '@app/services/toolbar/toolbar.service';
import { BrushService } from '@app/services/tools/brush/brush.service';
import { BucketService } from '@app/services/tools/bucket/bucket.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';
import { EraseService } from '@app/services/tools/erase/erase.service';
import { EyedropperService } from '@app/services/tools/eyedropper/eyedropper.service';
import { GridService } from '@app/services/tools/grid/grid.service';
import { LineService } from '@app/services/tools/line/line.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { PolygonService } from '@app/services/tools/polygon/polygon.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { TextService } from '@app/services/tools/text/text.service';

// tslint:disable:no-string-literal
describe('ToolbarService', () => {
    let service: ToolbarService;
    let pencilServiceSpy: jasmine.SpyObj<PencilService>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let polygonServiceSpy: jasmine.SpyObj<PolygonService>;
    let brushServiceSpy: jasmine.SpyObj<BrushService>;
    let rectangleServiceSpy: jasmine.SpyObj<RectangleService>;
    let ellipseServiceSpy: jasmine.SpyObj<EllipseService>;
    let lineServiceSpy: jasmine.SpyObj<LineService>;
    let eraseServiceSpy: jasmine.SpyObj<EraseService>;
    let eyedropperServiceSpy: jasmine.SpyObj<EyedropperService>;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
    let bucketServiceSpy: jasmine.SpyObj<BucketService>;
    let textServiceSpy: jasmine.SpyObj<TextService>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        pencilServiceSpy = jasmine.createSpyObj('PencilService', [
            'onKeyDown',
            'setColors',
            'onKeyUp',
            'onMouseMove',
            'onMouseDown',
            'onMouseUp',
            'onMouseEnter',
            'onMouseLeave',
            'onDoubleClick',
            'onClick',
            'setColors',
            'resetContext',
            'clone',
        ]);

        brushServiceSpy = jasmine.createSpyObj('BrushService', ['onKeyDown', 'resetContext', 'setColors']);
        rectangleServiceSpy = jasmine.createSpyObj('RectangleService', ['setTypeDrawing']);
        ellipseServiceSpy = jasmine.createSpyObj('EllipseService', ['setTypeDrawing']);
        lineServiceSpy = jasmine.createSpyObj('LineService', ['onKeyDown']);
        eraseServiceSpy = jasmine.createSpyObj('LineService', ['onKeyDown']);
        eyedropperServiceSpy = jasmine.createSpyObj('EyedropperService', ['onKeyDown']);
        selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['selectAll', 'resetSelection', 'setSelectionType', 'setThickness']);
        bucketServiceSpy = jasmine.createSpyObj('BucketService', ['onMouseDown']);
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setStrokeColor', 'setThickness']);
        polygonServiceSpy = jasmine.createSpyObj('PolygonService', ['onKeyDown']);
        textServiceSpy = jasmine.createSpyObj('TextService', ['onClick']);
        gridServiceSpy = jasmine.createSpyObj('GridService', ['onClick']);

        TestBed.configureTestingModule({
            providers: [
                { provide: PencilService, useValue: pencilServiceSpy },
                { provide: BrushService, useValue: brushServiceSpy },
                { provide: RectangleService, useValue: rectangleServiceSpy },
                { provide: EllipseService, useValue: ellipseServiceSpy },
                { provide: LineService, useValue: lineServiceSpy },
                { provide: EraseService, useValue: eraseServiceSpy },
                { provide: PolygonService, useValue: polygonServiceSpy },
                { provide: EyedropperService, useValue: eyedropperServiceSpy },
                { provide: BucketService, useValue: bucketServiceSpy },
                { provide: GridService, useValue: gridServiceSpy },
                { provide: TextService, useValue: textServiceSpy },
                { provide: DrawingService, useValue: drawingServiceSpy },
            ],
        });
        service = TestBed.inject(ToolbarService);
        pencilServiceSpy = TestBed.inject(PencilService) as jasmine.SpyObj<PencilService>;
        polygonServiceSpy = TestBed.inject(PolygonService) as jasmine.SpyObj<PolygonService>;
        brushServiceSpy = TestBed.inject(BrushService) as jasmine.SpyObj<BrushService>;
        rectangleServiceSpy = TestBed.inject(RectangleService) as jasmine.SpyObj<RectangleService>;
        ellipseServiceSpy = TestBed.inject(EllipseService) as jasmine.SpyObj<EllipseService>;
        lineServiceSpy = TestBed.inject(LineService) as jasmine.SpyObj<LineService>;
        eraseServiceSpy = TestBed.inject(EraseService) as jasmine.SpyObj<EraseService>;
        eyedropperServiceSpy = TestBed.inject(EyedropperService) as jasmine.SpyObj<EyedropperService>;
        selectionServiceSpy = TestBed.inject(SelectionService) as jasmine.SpyObj<SelectionService>;
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        bucketServiceSpy = TestBed.inject(BucketService) as jasmine.SpyObj<BucketService>;
        gridServiceSpy = TestBed.inject(GridService) as jasmine.SpyObj<GridService>;
        textServiceSpy = TestBed.inject(TextService) as jasmine.SpyObj<TextService>;

        drawingServiceSpy.canvas = canvasTestHelper.canvas;
        drawingServiceSpy.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceSpy.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service.getTools().forEach((tool: Tool) => {
            tool.executedCommand = new EventEmitter<Command>();
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('initializeListeners should set primary and secondary colors and subscribe to each tool', () => {
        // tslint:disable-next-line:no-any / reason: spying on function
        const setColorsSpy = spyOn<any>(service, 'setColors').and.callThrough();
        // tslint:disable-next-line:no-any no-empty / reason: spying on function
        const addCommandSpy = spyOn<any>(service, 'addCommand').and.callFake(() => {});
        service.initializeListeners();
        const pencilService = service.getTools()[0];
        pencilService.executedCommand.emit(pencilService.clone());
        expect(setColorsSpy).toHaveBeenCalled();
        expect(addCommandSpy).toHaveBeenCalled();
        expect(service.primaryColor).toBeTruthy();
        expect(service.secondaryColor).toBeTruthy();
    });

    it('unsubscribeListeners should unsubscribe to each subscription', () => {
        service.initializeListeners();

        // tslint:disable-next-line:no-any / reason: spying on function
        const primaryColorSpy = spyOn<any>(service['primaryColorSubscription'], 'unsubscribe');
        // tslint:disable-next-line:no-any / reason: spying on function
        const secondaryColorSpy = spyOn<any>(service['secondaryColorSubscription'], 'unsubscribe');
        // tslint:disable-next-line:no-any / reason: spying on function
        const toolSpy = spyOn<any>(service.toolsSubscription[0], 'unsubscribe');

        service.unsubscribeListeners();

        expect(toolSpy).toHaveBeenCalled();
        expect(primaryColorSpy).toHaveBeenCalled();
        expect(secondaryColorSpy).toHaveBeenCalled();
    });

    it('getTools should return an array of tool services ', () => {
        const tools = service.getTools();
        expect(tools).toEqual([
            pencilServiceSpy,
            brushServiceSpy,
            eraseServiceSpy,
            polygonServiceSpy,
            rectangleServiceSpy,
            ellipseServiceSpy,
            lineServiceSpy,
            selectionServiceSpy,
            eyedropperServiceSpy,
            bucketServiceSpy,
            textServiceSpy,
            gridServiceSpy,
        ]);
    });

    it('initializeListeners should set primary and secondary colors ', () => {
        // tslint:disable-next-line:no-any / reason: spying on function
        const setColorsSpy = spyOn<any>(service, 'setColors').and.callThrough();
        service.initializeListeners();
        expect(setColorsSpy).toHaveBeenCalled();
        expect(service.primaryColor).toBeTruthy();
        expect(service.secondaryColor).toBeTruthy();
    });

    it('setColors should set the colors and call applyCurrentToolColor', () => {
        // tslint:disable-next-line: no-any / reason: spying on function
        const applyColorSpy = spyOn<any>(service, 'applyCurrentToolColor').and.callFake(() => {
            return;
        });

        const color = new Color();
        // tslint:disable-next-line: no-any / reason: spying on function

        service.setColors(color, color);
        expect(service.primaryColor).toEqual(color);
        expect(service.secondaryColor).toEqual(color);
        expect(applyColorSpy).toHaveBeenCalled();
    });

    it('applyCurrentTool should call applyCurrentToolColor and call resetContext on currentTool', () => {
        // tslint:disable-next-line: no-any / reason: spying on function
        const applyColorSpy = spyOn<any>(service, 'applyCurrentToolColor').and.callFake(() => {
            return;
        });

        service.applyCurrentTool();
        expect(applyColorSpy).toHaveBeenCalled();
    });

    it('changeTool should change currentTool if tool is different and call applyCurrentTool', () => {
        // tslint:disable-next-line: no-any / reason: spying on function
        const applyColorSpy = spyOn<any>(service, 'applyCurrentToolColor').and.callFake(() => {
            return;
        });

        service.currentTool = pencilServiceSpy;
        service.changeTool(brushServiceSpy);
        expect(service.currentTool).toEqual(brushServiceSpy);
        expect(applyColorSpy).toHaveBeenCalled();
    });

    it('changeTool should should not call applyCurrentTool if tool is the same ', () => {
        // tslint:disable-next-line: no-any / reason: spying on function
        const applyColorSpy = spyOn<any>(service, 'applyCurrentToolColor').and.callFake(() => {
            return;
        });

        service.currentTool = pencilServiceSpy;
        service.changeTool(pencilServiceSpy);
        expect(service.currentTool).toEqual(pencilServiceSpy);
        expect(applyColorSpy).not.toHaveBeenCalled();
    });

    it('onKeyDown should call the onKeyDown of the currentTool', () => {
        service.currentTool = pencilServiceSpy;
        const keyboardEvent = { key: '' } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(service.currentTool).toEqual(pencilServiceSpy);
        expect(service.currentTool.onKeyDown).toHaveBeenCalledWith(keyboardEvent);
    });

    it('onKeyUp should call the onKeyUp of the currentTool', () => {
        service.currentTool = pencilServiceSpy;
        const keyboardEvent = { key: KeyShortcut.Pencil } as KeyboardEvent;
        service.onKeyUp(keyboardEvent);

        expect(service.currentTool.onKeyUp).toHaveBeenCalledWith(keyboardEvent);
    });

    it('onMouseMove should call the onMouseMove of the currentTool', () => {
        service.currentTool = pencilServiceSpy;
        const mouseEvent = {} as MouseEvent;
        service.onMouseMove(mouseEvent);

        expect(service.currentTool.onMouseMove).toHaveBeenCalledWith(mouseEvent);
    });

    it('onMouseDown should call the onMouseDown of the currentTool', () => {
        service.currentTool = pencilServiceSpy;
        const mouseEvent = {} as MouseEvent;
        service.onMouseDown(mouseEvent);

        expect(service.currentTool.onMouseDown).toHaveBeenCalledWith(mouseEvent);
    });

    it('onMouseUp should call the onMouseUp of the currentTool', () => {
        service.currentTool = pencilServiceSpy;
        const mouseEvent = {} as MouseEvent;
        service.onMouseUp(mouseEvent);

        expect(service.currentTool.onMouseUp).toHaveBeenCalledWith(mouseEvent);
    });

    it('onMouseEnter should call the onMouseEnter of the currentTool and set isInCanvas of eyedropper service to true', () => {
        service.currentTool = pencilServiceSpy;
        const mouseEvent = {} as MouseEvent;
        eyedropperServiceSpy.inCanvas = false;
        service.onMouseEnter(mouseEvent);

        expect(service.currentTool.onMouseEnter).toHaveBeenCalledWith(mouseEvent);
        expect(eyedropperServiceSpy.inCanvas).toBeTrue();
    });

    it('onMouseLeave should call the onMouseLeave of the currentTool and set inCanvas of eyedropper service to false', () => {
        service.currentTool = pencilServiceSpy;
        const mouseEvent = {} as MouseEvent;
        eyedropperServiceSpy.inCanvas = true;
        service.onMouseLeave(mouseEvent);

        expect(service.currentTool.onMouseLeave).toHaveBeenCalledWith(mouseEvent);
        expect(eyedropperServiceSpy.inCanvas).toBeFalse();
    });

    it('onDoubleClick should call the onDoubleClick of the currentTool', () => {
        service.currentTool = pencilServiceSpy;
        const mouseEvent = {} as MouseEvent;
        service.onDoubleClick(mouseEvent);

        expect(service.currentTool.onDoubleClick).toHaveBeenCalledWith(mouseEvent);
    });

    it('onClick should call the onClick of the currentTool', () => {
        service.currentTool = pencilServiceSpy;
        const mouseEvent = {} as MouseEvent;
        service.onClick(mouseEvent);

        expect(service.currentTool.onClick).toHaveBeenCalledWith(mouseEvent);
    });

    it('triggerSelectAll should change current tool to selection tool', () => {
        service.currentTool = pencilServiceSpy;
        service.triggerSelectAll();

        expect(service.currentTool).toEqual(selectionServiceSpy);
    });

    it('triggerSelectAll should call selectAll of selectionService', () => {
        // tslint:disable-next-line: no-any / reason: spying on function
        const selectAllSpy = spyOn<any>(selectionServiceSpy, 'selectAll').and.callFake(() => {
            return;
        });
        service.currentTool = pencilServiceSpy;
        service.triggerSelectAll();

        expect(selectAllSpy).toHaveBeenCalled();
    });

    it('isAreaSelected should return true if an area is selected', () => {
        selectionServiceSpy.isAreaSelected = true;
        const result = service.isAreaSelected();
        expect(result).toBeTrue();
    });

    it('isAreaSelected should return false if an area is not selected', () => {
        selectionServiceSpy.isAreaSelected = false;
        const result = service.isAreaSelected();
        expect(result).toBeFalse();
    });

    it('resetSelection should call resetSelection of selection service if area is selected', () => {
        // tslint:disable-next-line:no-any / reason : spying on function
        const resetSelectionSpy = spyOn<any>(selectionServiceSpy, 'resetSelection').and.callFake(() => {
            return;
        });
        selectionServiceSpy.isAreaSelected = true;
        service.resetSelection();
        expect(resetSelectionSpy).toHaveBeenCalled();
    });

    it('resetSelection should not call resetSelection of selection service if area is not selected', () => {
        // tslint:disable-next-line:no-any / reason : spying on function
        const resetSelectionSpy = spyOn<any>(selectionServiceSpy, 'resetSelection').and.callFake(() => {
            return;
        });
        selectionServiceSpy.isAreaSelected = false;
        service.resetSelection();
        expect(resetSelectionSpy).not.toHaveBeenCalled();
    });

    it('changeSelectionTool should call the onClick of the currentTool', () => {
        // tslint:disable-next-line:no-any / reason : spying on function
        const setSelectionTypeSpy = spyOn<any>(selectionServiceSpy, 'setSelectionType').and.callThrough();
        const expectedType = SelectionType.EllipseSelection;
        service.changeSelectionTool(expectedType);
        expect(setSelectionTypeSpy).toHaveBeenCalledWith(expectedType);
    });

    it('applyCurrentToolColor should call setColors of the currentTool', () => {
        service.currentTool = pencilServiceSpy;
        const color = new Color();
        service.primaryColor = color;
        service.secondaryColor = color;
        // tslint:disable-next-line:no-string-literal / reason : accessing private member
        service['applyCurrentToolColor']();
        expect(service.currentTool.setColors).toHaveBeenCalled();
    });

    it('addCommand should call addCommand from undoRedoService', () => {
        // tslint:disable-next-line:no-any / reason : spying on function
        const addCommandSpy = spyOn<any>(service['undoRedoService'], 'addCommand');
        service.addCommand(service.getTools()[0].clone());
        expect(addCommandSpy).toHaveBeenCalled();
    });

    it('undo should call undo from undoRedoService', () => {
        // tslint:disable-next-line:no-any / reason : spying on function
        const undoSpy = spyOn<any>(service['undoRedoService'], 'undo');
        service.undo();
        expect(undoSpy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('redo should call redo from undoRedoService', () => {
        // tslint:disable-next-line:no-any / reason : spying on function
        const redoSpy = spyOn<any>(service['undoRedoService'], 'redo');
        service.redo();
        expect(redoSpy).toHaveBeenCalled();
    });

    it('undo should call isDrawing and applyCurrentTool if isDrawing is false', () => {
        // tslint:disable-next-line:no-any / reason : spying on function
        const isDrawingSpy = spyOn<any>(service, 'isDrawing').and.callFake(() => {
            return false;
        });
        // tslint:disable-next-line:no-any / reason : spying on function
        const applyCurrentToolSpy = spyOn<any>(service, 'applyCurrentTool');
        const delay = 1000;
        jasmine.clock().install();
        service.undo();
        jasmine.clock().tick(delay);
        expect(isDrawingSpy).toHaveBeenCalled();
        expect(applyCurrentToolSpy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('redo should call isDrawing and applyCurrentTool if isDrawing is false', () => {
        // tslint:disable-next-line:no-any / reason : spying on function
        const isDrawing = spyOn<any>(service, 'isDrawing').and.callFake(() => {
            return false;
        });
        // tslint:disable-next-line:no-any / reason : spying on function
        const applyCurrentToolSpy = spyOn<any>(service, 'applyCurrentTool');
        service.redo();
        expect(isDrawing).toHaveBeenCalled();
        expect(applyCurrentToolSpy).toHaveBeenCalled();
    });

    it('undo should call isDrawing and not applyCurrentTool isDrawing is true', () => {
        // tslint:disable-next-line:no-any / reason : spying on function
        const isDrawing = spyOn<any>(service, 'isDrawing').and.callFake(() => {
            return true;
        });
        // tslint:disable-next-line:no-any / reason : spying on function
        const applyCurrentToolSpy = spyOn<any>(service, 'applyCurrentTool');
        const delay = 1000;
        jasmine.clock().install();
        service.undo();
        jasmine.clock().tick(delay);
        expect(isDrawing).toHaveBeenCalled();
        expect(applyCurrentToolSpy).not.toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('redo should call isDrawing and should not call applyCurrentTool if isDrawing is true', () => {
        // tslint:disable-next-line:no-any / reason : spying on function
        const isDrawing = spyOn<any>(service, 'isDrawing').and.callFake(() => {
            return true;
        });
        // tslint:disable-next-line:no-any / reason : spying on function
        const applyCurrentToolSpy = spyOn<any>(service, 'applyCurrentTool');
        service.redo();
        expect(isDrawing).toHaveBeenCalled();
        expect(applyCurrentToolSpy).not.toHaveBeenCalled();
    });

    it('isDrawing should call isAreaSelected() and return true an area is selected', () => {
        // tslint:disable-next-line:no-any / reason : spying on function
        const isAreaSelectedSpy = spyOn<any>(service, 'isAreaSelected').and.callFake(() => {
            return true;
        });

        service.mouseDown = false;
        const isDrawing = service.isDrawing();
        expect(isAreaSelectedSpy).toHaveBeenCalled();
        expect(isDrawing).toEqual(true);
    });

    it('isDrawing should return true if mouse is Down', () => {
        // tslint:disable-next-line:no-any / reason : spying on function
        selectionServiceSpy.isAreaSelected = false;
        service.mouseDown = true;
        const isDrawing = service.isDrawing();
        expect(isDrawing).toEqual(true);
    });
    // tslint:disable-next-line: max-file-line-count / reason: its a test file
});
