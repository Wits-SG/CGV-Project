import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext, GraphicsPrimitiveFactory, PhysicsColliderFactory } from '../lib/index';
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { InteractManager } from '../lib/w3ads/InteractManager';

export class StatuesConstruct extends Construct {

    floor!: THREE.Mesh
    floorTexture!: THREE.MeshLambertMaterial;
    textureFloorData!: any;

    // chess board
    board!: THREE.Mesh;

    // black and white squares
    blackSquares!: Array<THREE.Mesh>;
    whiteSquares!: Array<THREE.Mesh>;
    whiteSquaresTexture!: THREE.MeshLambertMaterial;
    blackSquaresTexture!: THREE.MeshLambertMaterial;
    whiteSquareData!: any;
    blackSquareData!: any;

    // plinth
    plinthTexture!: THREE.MeshLambertMaterial;
    plinthData!: any;

    // chess pieces
    pawn!: THREE.Group;
    bishop!: THREE.Group;
    rook!: THREE.Group;
    queen!: THREE.Group;
    knight!: THREE.Group;

    chessPlinths!: THREE.Group;

    font!: any;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions:InteractManager) {
        super(graphics, physics, interactions);
    }

    create() { }

    async load(): Promise<void> {
        try {
            this.textureFloorData = await this.graphics.loadTexture('assets/Poured_Concrete/ConcretePoured001_COL_2K_METALNESS.png');
        } catch (e: any) {
            console.error(e);
        }

        try {
            this.blackSquareData = await this.graphics.loadTexture('assets/Marble/black_marble.jpg');
        } catch (e: any) {
            console.error(e);
        }

        try {
            this.whiteSquareData = await this.graphics.loadTexture('assets/Marble/white_marble.jpeg');
        } catch (e: any) {
            console.error(e);
        }

        try {
            this.plinthData = await this.graphics.loadTexture('assets/Marble/plinths_marble.png');
        } catch (e: any) {
            console.error(e);
        }
        
        try {
            const gltfData: any = await this.graphics.loadModel('assets/Chess_Pieces/Pawn/scene.gltf');
            this.pawn = gltfData.scene;
        } catch (e: any) {
            console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('assets/Chess_Pieces/Bishop/scene.gltf');
            this.bishop = gltfData.scene;
        } catch (e: any) {
            console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('assets/Chess_Pieces/Rook/scene.gltf');
            this.rook = gltfData.scene;
        } catch (e: any) {
            console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('assets/Chess_Pieces/Queen/scene.gltf');
            this.queen = gltfData.scene;
        } catch (e: any) {
            console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('assets/Chess_Pieces/Knight/scene.gltf');
            this.knight = gltfData.scene;
        } catch (e: any) {
            console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('assets/Chess_Plinths/chess_plinth.gltf');
            this.chessPlinths = gltfData.scene;
        } catch (e: any) {
            console.log(e);
        }

        try {
            const textData: any = await this.graphics.loadFont('assets/fonts/Montserrat_Bold.json');
            this.font = textData;
        } catch (e: any) {
            console.log(e)
        }

    }

    build() {

        // Floor plane
        const geometry = new THREE.BoxGeometry(60, 1, 60);
        this.floorTexture = new THREE.MeshLambertMaterial({ map: this.textureFloorData, side: THREE.DoubleSide });
        this.floor = new THREE.Mesh(geometry, this.floorTexture);
        this.physics.addStatic(this.floor, PhysicsColliderFactory.box(30, 0.5, 30));
        
        // Chess board
        const board_base = new THREE.BoxGeometry(30, 0.2, 30);
        const boardColour = new THREE.MeshLambertMaterial({ color: 0x393939 });
        this.board = new THREE.Mesh(board_base, boardColour);
        this.board.position.set(0, 0.6, 0);

        // Define the number of rows and columns on the chessboard
        const numRows = 8;
        const numCols = 8;

        // Size of each square
        const squareSize = 3;

        // Initialize arrays to hold black and white squares
        this.blackSquares = [];
        this.whiteSquares = [];

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const x = col * squareSize - (squareSize * (numCols - 1)) / 2;
                const z = row * squareSize - (squareSize * (numRows - 1)) / 2;

                const geometry = new THREE.BoxGeometry(squareSize, 0.2, squareSize);
                const texture = (row + col) % 2 === 0 ? this.blackSquareData : this.whiteSquareData;
                const material = new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide });

                const square = new THREE.Mesh(geometry, material);
                square.position.set(x, 0.2, z);

                if ((row + col) % 2 === 0) {
                    this.blackSquares.push(square);
                } else {
                    this.whiteSquares.push(square);
                }
                this.board.add(square);
                this.interactions.addPickupSpot(square, 5, (placeObject: THREE.Object3D) => {
                    square.add(placeObject);
                    placeObject.position.set(0, 0, 0);
                    placeObject.scale.setScalar(2);
                });
            }
        }

        // Board Numbers
            const numberSpacing = 3; // Adjust the spacing between numbers
            const startingNumberX = -11; // Adjust the starting X position

            for (let i = 1; i <= 8; i++) {
                const numberText = i.toString();
                const geometry = new TextGeometry(numberText, {
                    font: this.font,
                    size: 1,
                    height: 0,
                });

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshLambertMaterial({ color: 0xffffff })]);

                const xOffset = startingNumberX + (i - 1) * numberSpacing;
                textMesh.position.set(xOffset, 0.3, -14);
                textMesh.rotation.set(Math.PI/2, Math.PI, Math.PI/2);

                this.board.add(textMesh);
            }

            // Board Letters
            const letterSpacing = 3; // Adjust the spacing between letters
            const startingLetterX = -14; // Adjust the starting X position
        
            for (let i = 0; i < 8; i++) {
                const letterText = String.fromCharCode(65 + i); // Convert ASCII code to letters (A-H)
                const geometry = new TextGeometry(letterText, {
                    font: this.font,
                    size: 1,
                    height: 0,
                });
        
                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshLambertMaterial({ color: 0xffffff })]);
        
                const xOffset = startingLetterX + i * letterSpacing + 3;
                textMesh.position.set(-14, 0.3, xOffset); // Adjust the Z position to place letters at the bottom
                textMesh.rotation.set(Math.PI/2, Math.PI, Math.PI / 2);
        
                this.board.add(textMesh);
            }

        // Plinths (using the chess_plinth model)
        const plinthSpacing = 7;

        for (let i = 0; i < 5; i++) {
            const additionalPlinth = this.chessPlinths.clone();
            additionalPlinth.scale.set(0.3, 0.3, 0.3);

            // Position the additional plinths below the current one with spacing
            additionalPlinth.position.set(22, 0, -21 + (i + 1) * plinthSpacing);
            
            this.floor.add(additionalPlinth);

            this.interactions.addPickupSpot(additionalPlinth, 5, (placeObject: THREE.Object3D) => {
                additionalPlinth.add(placeObject);
                placeObject.position.set(0, 10, 0);
                placeObject.scale.setScalar(2);
            });

            const worldPos = new THREE.Vector3();
            additionalPlinth.getWorldPosition(worldPos);
            console.log(worldPos);
        }

        // Plinths colliders
        const plinthBoxSpacing = 7;
        const plinthBoxGeom = new THREE.BoxGeometry(3,6,2);
        const plinthBoxMat = new THREE.MeshLambertMaterial({ color: 0x00ff00});

        for (let i = 0; i < 5; i++){
            const plinths = new THREE.Mesh(plinthBoxGeom, plinthBoxMat);
            plinths.position.set(22, 0, -21 + (i + 1) * plinthBoxSpacing);
            this.physics.addStatic(plinths, PhysicsColliderFactory.box(1.5,3,1.5));
    
            this.floor.add(plinths);
            plinths.removeFromParent();
        }

        // Add Chess pieces
        const tempPawn = this.pawn;
        tempPawn.position.set(-10.5,0.3,-10.5);
        this.interactions.addPickupObject(tempPawn, 5, 1, ()=> {})
        this.board.add(tempPawn);

        const tempBishop = this.bishop;
        tempBishop.position.set(-4.5,0.3,-7.5);
        this.interactions.addPickupObject(tempBishop, 5, 1, ()=> {})
        this.board.add(tempBishop);

        const tempRook = this.rook;
        tempRook.position.set(7.5,0.3,-1.5);
        this.interactions.addPickupObject(tempRook, 5, 1, ()=> {})
        this.board.add(tempRook);

        const tempQueen = this.queen;
        tempQueen.position.set(-7.5,0.3,1.5);
        this.interactions.addPickupObject(tempQueen, 5, 1, ()=> {})
        this.board.add(tempQueen);

        const tempKnight = this.knight;
        tempKnight.position.set(1.5,0.3,10.5);
        this.interactions.addPickupObject(tempKnight, 5, 1, ()=> {})
        this.board.add(tempKnight);

        //Add point lights at the corners of board
        const cornerLight1 = new THREE.PointLight(0xffffff, 500, 100);
        cornerLight1.position.set(-15, 10, -15); // Adjust the position as per your needs
        this.board.add(cornerLight1);

        const cornerLight2 = new THREE.PointLight(0xffffff, 500, 100);
        cornerLight2.position.set(15, 10, -15); 
        this.board.add(cornerLight2);

        const cornerLight3 = new THREE.PointLight(0xffffff, 500, 100);
        cornerLight3.position.set(-15, 10, 15); 
        this.board.add(cornerLight3);

        const cornerLight4 = new THREE.PointLight(0xffffff, 500, 100);
        cornerLight4.position.set(15, 10, 15); 
        this.board.add(cornerLight4);

        const middleLight = new THREE.PointLight(0xffffff, 500, 100);
        middleLight.position.set(0,10,0);
        this.board.add(middleLight);
        

        // Add point lights to the back of each plinth
        const plinthBackLight1 = new THREE.PointLight(0xffffff, 40, 20); // Adjust intensity and distance
        plinthBackLight1.position.set(25, 10, -15); 
        this.floor.add(plinthBackLight1);

        const plinthBackLight2 = new THREE.PointLight(0xffffff, 40, 20); // Adjust intensity and distance
        plinthBackLight2.position.set(25, 10, -10); 
        this.floor.add(plinthBackLight2);

        const plinthBackLight3 = new THREE.PointLight(0xffffff, 40, 20); // Adjust intensity and distance
        plinthBackLight3.position.set(25, 10, -15); 
        this.floor.add(plinthBackLight3);

        const plinthBackLight4 = new THREE.PointLight(0xffffff, 40, 20); // Adjust intensity and distance
        plinthBackLight4.position.set(25, 10, 0); 
        this.floor.add(plinthBackLight4);

        const plinthBackLight5 = new THREE.PointLight(0xffffff, 40, 20); // Adjust intensity and distance
        plinthBackLight5.position.set(25, 10, 5); 
        this.floor.add(plinthBackLight5);

        // Add the floor to the sceneq
        this.add(this.floor);
        // Add chessboard to the scene
        this.add(this.board);
    }

    
    

    update() { 
    }

    destroy() { }
}
