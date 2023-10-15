import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext, PhysicsColliderFactory } from '../lib/index';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { Crystal } from './Crystal';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';
import { Lectern } from './Lectern';

export class StatuesConstruct extends Construct {

    floor!: THREE.Mesh

    wallTexture!: any;

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
    pawn!: any;
    bishop!: any;
    rook!: any;
    queen!: any;
    knight!: any;
    set!: any;

    pawnImg!: any;
    bishopImg!: any;
    rookImg!: any;
    queenImg!: any;
    knightImg!: any;

    chessPlinths!: any;

    font!: any;

    solution: Array<number>;
    current: Array<number>;

    crystal!: Crystal; 
    lectren!: Lectern;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        super(graphics, physics, interactions, userInterface);
        this.solution = [];
        this.current = [-1, -1, -1, -1, -1];

        this.crystal = new Crystal(graphics, physics, interactions, userInterface);
        this.addConstruct(this.crystal);

        const title = 'Chess Puzzle';
        const paragraphs = ["Prompt: In the realm of the royal game, five subjects poised to rise to fame. Their order hidden in the field, a chessboard's secrets shall be revealed. Look to the ranks and files with care, and on the plinths, their order bear.","Hint: Begin your quest by seeking the lowest coordinates; the ranks and files shall be your guides. Patience, and a keen eye for position, shall unveil the puzzle's hidden mission."];
        this.lectren = new Lectern(graphics, physics, interactions, userInterface, title, paragraphs);
        this.addConstruct(this.lectren);

    }

    create() { 
        this.crystal.root.position.set(0,-10,0);
        this.lectren.root.position.set(0,1,20);
        this.lectren.root.rotation.set(0, Math.PI,0);
    }

    async load(): Promise<void> {
        try {
            this.blackSquareData = await this.graphics.loadTexture('assets/Marble/black_marble.jpg');
        } catch (e: any) {
            console.log(e);
        }

        try {
            this.whiteSquareData = await this.graphics.loadTexture('assets/Marble/white_marble.jpeg');
        } catch (e: any) {
            console.log(e);
        }

        try {
            this.plinthData = await this.graphics.loadTexture('assets/Marble/plinths_marble.png');
        } catch (e: any) {
            console.log(e);
        }
        
        try {
            const gltfData: any = await this.graphics.loadModel('assets/Chess_Pieces/Pawn/scene.gltf');
            this.pawn = gltfData.scene;
        } catch (e: any) {
            console.log(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('assets/Chess_Pieces/Bishop/scene.gltf');
            this.bishop = gltfData.scene;
        } catch (e: any) {
            console.log(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('assets/Chess_Pieces/Rook/scene.gltf');
            this.rook = gltfData.scene;
        } catch (e: any) {
            console.log(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('assets/Chess_Pieces/Queen/scene.gltf');
            this.queen = gltfData.scene;
        } catch (e: any) {
            console.log(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('assets/Chess_Pieces/Knight/scene.gltf');
            this.knight = gltfData.scene;
        } catch (e: any) {
            console.log(e);
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

        try {
            this.pawnImg = await this.graphics.loadTexture('assets/Chess_Pieces_Images/pawn.png');
        } catch (e: any) {
            console.log(e);
        }

        try {
            this.bishopImg = await this.graphics.loadTexture('assets/Chess_Pieces_Images/bishop.png');
        } catch (e: any) {
            console.log(e);
        }

        try {
            this.knightImg = await this.graphics.loadTexture('assets/Chess_Pieces_Images/knight.png');
        } catch (e: any) {
            console.log(e);
        }

        try {
            this.queenImg = await this.graphics.loadTexture('assets/Chess_Pieces_Images/queen.png');
        } catch (e: any) {
            console.log(e);
        }

        try {
            this.rookImg = await this.graphics.loadTexture('assets/Chess_Pieces_Images/rook.png');
        } catch (e: any) {
            console.log(e);
        }

        try {
            this.wallTexture = await this.graphics.loadTexture('assets/Material.001_baseColor.png');
        } catch (e: any) {
            console.log(e);
        }

    }

    build() {
        // Floor plane
        const geometry = new THREE.BoxGeometry(60, 1, 60);
        const floorTexture = new THREE.MeshLambertMaterial({ color: 0x566573, side: THREE.DoubleSide });
        this.floor = new THREE.Mesh(geometry, floorTexture);
        this.add(this.floor);
        this.floor.receiveShadow = true;
        this.physics.addStatic(this.floor, PhysicsColliderFactory.box(30, 0.5, 30));

        // Wall and roof parameters
        const wallMat = new THREE.MeshLambertMaterial({ map: this.wallTexture});
        const backWallGeom = new THREE.BoxGeometry(60,20,1);
        const sideWallGeom = new THREE.BoxGeometry(1,20,60);

        const backWall = new THREE.Mesh(backWallGeom, wallMat);
        const sideWallLeft = new THREE.Mesh(sideWallGeom, wallMat);
        const sideWallRight = new THREE.Mesh(sideWallGeom, wallMat);

        sideWallLeft.position.set(-29.5,10,0);
        sideWallRight.position.set(29.5,10,0);
        backWall.position.set(0,10,-30);

        this.add(sideWallLeft);
        this.add(sideWallRight);
        this.add(backWall);

        this.physics.addStatic(sideWallLeft, PhysicsColliderFactory.box(1, 10, 30));
        this.physics.addStatic(sideWallRight, PhysicsColliderFactory.box(1, 10, 30));
        this.physics.addStatic(backWall, PhysicsColliderFactory.box(30, 10, 1));

        const roofLightCenter = new THREE.PointLight(0xFCAE70, 10, 250 ,0);
        roofLightCenter.position.set(0,19,0);

        const roofMat = new THREE.MeshLambertMaterial({ color: 0x999999});
        const roofGeom = new THREE.PlaneGeometry(60,60);
        const roof = new THREE.Mesh(roofGeom, roofMat);

        roof.rotation.set(Math.PI/2, 0, 0);
        roof.position.set(0,20,0);

        this.add(roof);
        this.add(roofLightCenter);

        
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

        // Create a 2D array to represent the chessboard grid
        const chessboardGrid: THREE.Mesh[][] = [];

        for (let row = 0; row < numRows; row++) {
            const rowArray: THREE.Mesh[] = [];
            
            for (let col = 0; col < numCols; col++) {
                // Determine the texture based on row and column indices
                const texture = (row + col) % 2 === 0 ? this.blackSquareData : this.whiteSquareData;

                const x = col * squareSize - (squareSize * (numCols - 1)) / 2;
                const z = row * squareSize - (squareSize * (numRows - 1)) / 2;

                const geometry = new THREE.BoxGeometry(squareSize, 0.2, squareSize);
                const material = new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide });

                const square = new THREE.Mesh(geometry, material);
                rowArray.push(square);
                square.position.set(x, 0.2, z);
                this.board.add(square);

                this.interactions.addPickupSpot(square, 5, (placeObject: THREE.Object3D) => {
                    square.add(placeObject);
                    placeObject.position.set(0, 0, 0);
                    placeObject.scale.setScalar(2);
                });
            }

            chessboardGrid.push(rowArray);
        }

        // Board Numbers
        const numberSpacing = 3; // Adjust the spacing between numbers
        const startingNumberX = -10 ; // Adjust the starting X position

        for (let i = 1; i <= 8; i++) {
            const numberText = i.toString();
            const geometry = new TextGeometry(numberText, {
                font: this.font,
                size: 1,
                height: 0,
            });

            const textMesh = new THREE.Mesh(geometry, [new THREE.MeshLambertMaterial({ color: 0xffffff })]);

            const yOffset = startingNumberX + (i - 1) * numberSpacing - 1;
            textMesh.position.set(-14, 0.3, -yOffset);
            textMesh.rotation.set(Math.PI/2, Math.PI, Math.PI);

            this.board.add(textMesh);
        }

        // Board Letters
        const letterSpacing = 3; // Adjust the spacing between letters
        const startingLetterX = -11; // Adjust the starting X position
    
        for (let i = 0; i < 8; i++) {
            const letterText = String.fromCharCode(65 + i); // Convert ASCII code to letters (A-H)
            const geometry = new TextGeometry(letterText, {
                font: this.font,
                size: 1,
                height: 0,
            });
    
            const textMesh = new THREE.Mesh(geometry, [new THREE.MeshLambertMaterial({ color: 0xffffff })]);
    
            const xOffset = startingLetterX + (i - 1) * letterSpacing + 3;
            textMesh.position.set(xOffset, 0.3, 14); 
            textMesh.rotation.set(Math.PI/2, Math.PI, Math.PI);
    
            this.board.add(textMesh);
        }

        // Plinths (using the chess_plinth model)
        const plinthSpacing = 7;
        const plinths: Array<THREE.Group> = [];
        for (let i = 0; i < 5; i++) {

            const listener = new THREE.AudioListener();
            const sound = new THREE.Audio( listener );
            const audioLoader = new THREE.AudioLoader()

            const additionalPlinth = this.chessPlinths.clone();
            additionalPlinth.scale.set(0.3, 0.3, 0.3);

            // Position the additional plinths below the current one with spacing
            additionalPlinth.position.set(-21 + (i + 1) * plinthSpacing, 0, -22 );
            additionalPlinth.castShadow = true;
            plinths.push(additionalPlinth);
            this.floor.add(additionalPlinth);

            this.interactions.addPickupSpot(additionalPlinth, 5, (placeObject: THREE.Object3D) => {
                additionalPlinth.add(placeObject);
                placeObject.position.set(0, 10, 0);
                placeObject.scale.setScalar(2);
                this.current[i] = placeObject.userData.pieceType;

                let result = true;
                for (let j = 0; j < this.solution.length; ++j) {
                    result = result  && this.solution[j] == this.current[j];
                }

                if (result) {
                    this.crystal.root.position.set(0,5,0);
                    audioLoader.load( 'sound/Chess/success.mp3', function( buffer ) {
                        sound.setBuffer(buffer);
                        sound.setLoop(false);
                        sound.setVolume(1);
                        
                        sound.play();
                    });
                } else {
                    let allPlaced  = true;
                    for (let k = 0; k < plinths.length; k++) {
                        allPlaced = allPlaced && plinths[k].children.length == 5;
                    }
                    if (allPlaced) {
                        audioLoader.load( 'sound/Chess/failure.mp3', function( buffer ) {
                            sound.setBuffer(buffer);
                            sound.setLoop(false);
                            sound.setVolume(1);
                            
                            sound.play();
                        });
                    }
                }
            });
        }

        // Plinths colliders
        const plinthBoxSpacing = 7;
        const plinthBoxGeom = new THREE.BoxGeometry(3,6,2);
        const plinthBoxMat = new THREE.MeshLambertMaterial({ color: 0x00ff00});

        for (let i = 0; i < 5; i++){
            const plinths = new THREE.Mesh(plinthBoxGeom, plinthBoxMat);
            plinths.position.set(-21 + (i + 1) * plinthBoxSpacing, 0, -22);
            this.floor.add(plinths);
            this.physics.addStatic(plinths, PhysicsColliderFactory.box(1.5,3,1.5));
            plinths.removeFromParent();
        }

        const pieceArray = [
            this.pawn, this.knight, this.bishop, this.rook, this.queen
        ];

        const pieceImgArray = [
            this.pawnImg, this.knightImg, this.bishopImg, this.rookImg, this.queenImg
        ];
        const usedColumns: Array<boolean> = [ false, false, false, false, false, false, false, false ];
        let pieceColumns: Array<number> = [-1, -1, -1, -1, -1, -1, -1, -1];

        for (let i = 0; i < pieceArray.length; ++i) {
            const piece = pieceArray[i];
            const row = Math.floor(Math.random() * 8);
            let col = Math.floor(Math.random() * 8);
            while ( usedColumns[col] ) { col = Math.floor(Math.random() * 8); }
            usedColumns[col] = true;
            pieceColumns[col] = i;

            chessboardGrid[row][col].add(piece);
            piece.castShadow = true;
            piece.position.set(0, 0, 0);
            piece.scale.setScalar(2);
            piece.userData.pieceType = i;
            this.interactions.addPickupObject(piece, 5, 1, () => {});

            const pieceImage = new THREE.Mesh(new THREE.PlaneGeometry(2,2), new THREE.MeshLambertMaterial({map: pieceImgArray[i], side: THREE.DoubleSide}));
            pieceImage.position.set(0,0.2,0);
            pieceImage.rotation.set(Math.PI/2, 0, Math.PI);
            chessboardGrid[row][col].add(pieceImage);

        }

        this.solution = pieceColumns.filter(val => val != -1);

        // Add chessboard to the scene
        this.add(this.board);
        this.board.receiveShadow = true;

        // Corner Chess Pieces
        const giantKnight = this.knight.clone();
        giantKnight.position.set(22,1,-22);
        giantKnight.rotation.set(0, -Math.PI/4, 0);
        giantKnight.scale.set(8,8,8);
        giantKnight.castShadow = true;
        this.floor.add(giantKnight);
        this.physics.addStatic(giantKnight , PhysicsColliderFactory.box(3, 10, 3));
        

        const giantQueen = this.queen.clone();
        giantQueen.position.set(-22,1,-22);
        giantQueen.scale.set(8,8,8);
        giantQueen.castShadow = true;
        this.floor.add(giantQueen);
        this.physics.addStatic(giantQueen , PhysicsColliderFactory.box(3, 10, 3));
        

        const giantBishop = this.bishop.clone();
        giantBishop.position.set(22,1,24);
        giantBishop.scale.set(8,8,8);
        giantBishop.castShadow = true;
        this.floor.add(giantBishop);
        this.physics.addStatic(giantBishop , PhysicsColliderFactory.box(2.5, 10, 2.5));
        

        const giantRook = this.rook.clone();
        giantRook.position.set(-22,1,24);
        giantRook.scale.set(8,8,8);
        giantRook.castShadow = true;
        this.floor.add(giantRook);  
        this.physics.addStatic(giantRook , PhysicsColliderFactory.box(2.5, 10, 2.5));
              
    } 

    update() { 
    }

    destroy() { }
}
