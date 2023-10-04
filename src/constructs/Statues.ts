import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext, GraphicsPrimitiveFactory, PhysicsColliderFactory } from '../lib/index';
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

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

    constructor(graphics: GraphicsContext, physics: PhysicsContext) {
        super(graphics, physics);
    }

    create() { }

    async load(): Promise<void> {
        try {
            this.textureFloorData = await this.graphics.loadTexture('public/asssets/Poured_Concrete/ConcretePoured001_COL_2K_METALNESS.png');
        } catch (e: any) {
            console.error(e);
        }

        try {
            this.blackSquareData = await this.graphics.loadTexture('public/asssets/Marble/black_marble.jpg');
        } catch (e: any) {
            console.error(e);
        }

        try {
            this.whiteSquareData = await this.graphics.loadTexture('public/asssets/Marble/white_marble.jpeg');
        } catch (e: any) {
            console.error(e);
        }

        try {
            this.plinthData = await this.graphics.loadTexture('public/asssets/Marble/plinths_marble.png');
        } catch (e: any) {
            console.error(e);
        }
        
        try {
            const gltfData: any = await this.graphics.loadModel('public/asssets/Chess_Pieces/Pawn/scene.gltf');
            this.pawn = gltfData.scene;
        } catch (e: any) {
            console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('public/asssets/Chess_Pieces/Bishop/scene.gltf');
            this.bishop = gltfData.scene;
        } catch (e: any) {
            console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('public/asssets/Chess_Pieces/Rook/scene.gltf');
            this.rook = gltfData.scene;
        } catch (e: any) {
            console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('public/asssets/Chess_Pieces/Queen/scene.gltf');
            this.queen = gltfData.scene;
        } catch (e: any) {
            console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('public/asssets/Chess_Pieces/Knight/scene.gltf');
            this.knight = gltfData.scene;
        } catch (e: any) {
            console.error(e);
        }

    }

    build() {

        // Floor plane
        const geometry = new THREE.BoxGeometry(60, 60, 1);
        this.floorTexture = new THREE.MeshLambertMaterial({ map: this.textureFloorData, side: THREE.DoubleSide });
        this.floor = new THREE.Mesh(geometry, this.floorTexture);
        this.floor.rotation.set(Math.PI / 2, 0, 0);
        this.floor.position.set(0, 0, 0);
        

        // Chess board
        const board_base = new THREE.BoxGeometry(30, 30, 0.4);
        const boardColour = new THREE.MeshLambertMaterial({ color: 0x393939 });
        this.board = new THREE.Mesh(board_base, boardColour);
        this.board.position.set(0, 0.7, 0);
        this.board.rotation.set(Math.PI / 2, 0, 0);

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

                const geometry = new THREE.BoxGeometry(squareSize, squareSize, 0.5);
                const texture = (row + col) % 2 === 0 ? this.blackSquareData : this.whiteSquareData;
                const material = new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide });

                const square = new THREE.Mesh(geometry, material);
                //square.rotation.set(Math.PI/2, 0, 0);
                square.position.set(x, z, -0.4);

                if ((row + col) % 2 === 0) {
                    this.blackSquares.push(square);
                } else {
                    this.whiteSquares.push(square);
                }

                this.board.add(square);
            }
        }

        // Text
        const loader = new FontLoader();
        loader.load('src/fonts/Montserrat_Bold.json', (font) => {

            // Plinth numbering
            const plinthSpace = 5;
            const startingPlinth = -10;

            for (let i = 1; i <=5; i++){
                const numberText = i.toString();
                const geometry = new TextGeometry(numberText, {
                    font: font,
                    size: 0.5,
                    height: 0,
                });

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshLambertMaterial({ color: 0x000000 })]);

                const xOffset = startingPlinth + (i - 1) * plinthSpace;
                textMesh.position.set(23.45, 0.7, xOffset);
                textMesh.rotation.set(Math.PI/2, 3*Math.PI/2, Math.PI/2);

                this.graphics.add(textMesh);
            }

            // Board Numbers
            const numberSpacing = 3; // Adjust the spacing between numbers
            const startingNumberX = -11; // Adjust the starting X position

            for (let i = 1; i <= 8; i++) {
                const numberText = i.toString();
                const geometry = new TextGeometry(numberText, {
                    font: font,
                    size: 1,
                    height: 0,
                });

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshLambertMaterial({ color: 0xffffff })]);

                const xOffset = startingNumberX + (i - 1) * numberSpacing;
                textMesh.position.set(xOffset, -14, -0.3);
                textMesh.rotation.set(0, Math.PI, Math.PI/2);

                this.board.add(textMesh);
            }

            // Board Letters
            const letterSpacing = 3; // Adjust the spacing between letters
            const startingLetterX = -14; // Adjust the starting X position
        
            for (let i = 0; i < 8; i++) {
                const letterText = String.fromCharCode(65 + i); // Convert ASCII code to letters (A-H)
                const geometry = new TextGeometry(letterText, {
                    font: font,
                    size: 1,
                    height: 0,
                });
        
                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshLambertMaterial({ color: 0xffffff })]);
        
                const xOffset = startingLetterX + i * letterSpacing + 3;
                textMesh.position.set(-14, xOffset, -0.3); // Adjust the Z position to place letters at the bottom
                textMesh.rotation.set(0, Math.PI, Math.PI / 2);
        
                this.board.add(textMesh);
            }
        });

        // Plinths
        const plinthGroup = new THREE.Group();

        // Plinth (Box)
        const plinthBoxGeometry = new THREE.BoxGeometry(3, 0.8, 3);
        const plinthBoxMaterial = new THREE.MeshLambertMaterial({ map: this.plinthData, side: THREE.DoubleSide });
        const plinth = new THREE.Mesh(plinthBoxGeometry, plinthBoxMaterial);
        plinth.rotation.set(Math.PI / 2, 0, 0);
        plinth.position.set(25, -15, -0.9);

        // Cylinder 1
        const cylinderGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 15);
        const cylinderMaterial = new THREE.MeshLambertMaterial({ map: this.plinthData, side: THREE.DoubleSide });
        const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinderMesh.rotation.set(Math.PI/2, 0, 0);
        cylinderMesh.position.set(25, -15, -1.5); 

        // Cylinder 2
        const cylinderGeometry2 = new THREE.CylinderGeometry(1, 1, 3, 15);
        const cylinderMaterial2 = new THREE.MeshLambertMaterial({ map: this.plinthData, side: THREE.DoubleSide });
        const cylinderMesh2 = new THREE.Mesh(cylinderGeometry2, cylinderMaterial2);
        cylinderMesh2.rotation.set(Math.PI/2, 0, 0);
        cylinderMesh2.position.set(25, -15, -3); 

        // Cylinder 3
        const cylinderGeometry3 = new THREE.CylinderGeometry(1.5, 1.5, 0.3, 15);
        const cylinderMaterial3 = new THREE.MeshLambertMaterial({ map: this.plinthData, side: THREE.DoubleSide });
        const cylinderMesh3 = new THREE.Mesh(cylinderGeometry3, cylinderMaterial3);
        cylinderMesh3.rotation.set(Math.PI/2, 0, 0);
        cylinderMesh3.position.set(25, -15, -4.5); 

        // Add the plinth and the cylinder to the group
        plinthGroup.add(plinth);
        plinthGroup.add(cylinderMesh);
        plinthGroup.add(cylinderMesh2);
        plinthGroup.add(cylinderMesh3);

        const plinthSpacing = 5; 
        for (let i = 0; i < 5; i++) {
            const additionalPlinthGroup = plinthGroup.clone(); // Clone the existing plinth group
            additionalPlinthGroup.position.y += (i + 1) * plinthSpacing; // Adjust the X position for spacing
            this.floor.add(additionalPlinthGroup);
        }

        // Add Chess pieces
        const tempPawn = this.pawn.clone();
        tempPawn.position.set(-10.5,-10.5,-0.6);
        tempPawn.rotation.set(-Math.PI/2, Math.PI, 0);
        tempPawn.scale.set(2,2,2);
        this.board.add(tempPawn);

        const tempBishop = this.bishop.clone();
        tempBishop.position.set(-4.5,-7.5,-0.6);
        tempBishop.rotation.set(-Math.PI/2, Math.PI, 0);
        tempBishop.scale.set(2,2,2);
        this.board.add(tempBishop);

        const tempRook = this.rook.clone();
        tempRook.position.set(7.5,-1.5,-0.6);
        tempRook.rotation.set(-Math.PI/2, Math.PI, 0);
        tempRook.scale.set(2,2,2);
        this.board.add(tempRook);

        const tempQueen = this.queen.clone();
        tempQueen.position.set(-7.5,1.5,-0.6);
        tempQueen.rotation.set(-Math.PI/2, Math.PI, 0);
        tempQueen.scale.set(2,2,2);
        this.board.add(tempQueen);

        const tempKnight = this.knight.clone();
        tempKnight.position.set(1.5,10.5,-0.6);
        tempKnight.rotation.set(-Math.PI/2, Math.PI, 0);
        tempKnight.scale.set(2,2,2);
        this.board.add(tempKnight);

        // Add point lights at the corners of board
        const cornerLight1 = new THREE.PointLight(0xffffff, 500, 100);
        cornerLight1.position.set(-15, -15, -10); // Adjust the position as per your needs
        this.board.add(cornerLight1);

        const cornerLight2 = new THREE.PointLight(0xffffff, 500, 100);
        cornerLight2.position.set(15, -15, -10); 
        this.board.add(cornerLight2);

        const cornerLight3 = new THREE.PointLight(0xffffff, 500, 100);
        cornerLight3.position.set(-15, 15, -10); 
        this.board.add(cornerLight3);

        const cornerLight4 = new THREE.PointLight(0xffffff, 500, 100);
        cornerLight4.position.set(15, 15, -10); 
        this.board.add(cornerLight4);

        const middleLight = new THREE.PointLight(0xffffff, 500, 100);
        middleLight.position.set(0,0,-10);
        this.board.add(middleLight);
        

        // Add point lights to the back of each plinth
        const plinthBackLight1 = new THREE.PointLight(0xffffff, 40, 20); // Adjust intensity and distance
        plinthBackLight1.position.set(25, -15, -10); 
        this.floor.add(plinthBackLight1);

        const plinthBackLight2 = new THREE.PointLight(0xffffff, 40, 20); // Adjust intensity and distance
        plinthBackLight2.position.set(25, -10, -10); 
        this.floor.add(plinthBackLight2);

        const plinthBackLight3 = new THREE.PointLight(0xffffff, 40, 20); // Adjust intensity and distance
        plinthBackLight3.position.set(25, -5, -10); 
        this.floor.add(plinthBackLight3);

        const plinthBackLight4 = new THREE.PointLight(0xffffff, 40, 20); // Adjust intensity and distance
        plinthBackLight4.position.set(25, 0, -10); 
        this.floor.add(plinthBackLight4);

        const plinthBackLight5 = new THREE.PointLight(0xffffff, 40, 20); // Adjust intensity and distance
        plinthBackLight5.position.set(25, 5, -10); 
        this.floor.add(plinthBackLight5)

        // Add the floor to the scene
        this.graphics.add(this.floor);
        // Add chessboard to the scene
        this.graphics.add(this.board);
    }

    
    

    update() { }

    destroy() { }
}
