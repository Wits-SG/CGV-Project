import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext, GraphicsPrimitiveFactory, PhysicsColliderFactory } from '../lib/index';
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

export class StatuesConstruct extends Construct {

    floor!: THREE.Mesh
    floorTexture!: THREE.MeshBasicMaterial;
    textureFloorData!: any;

    // chess board
    board!: THREE.Mesh;

    // black and white squares
    blackSquares!: Array<THREE.Mesh>;
    whiteSquares!: Array<THREE.Mesh>;
    whiteSquaresTexture!: THREE.MeshBasicMaterial;
    blackSquaresTexture!: THREE.MeshBasicMaterial;
    whiteSquareData!: any;
    blackSquareData!: any;

    // plinth
    plinthTexture!: THREE.MeshBasicMaterial;
    plinthData!: any;

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
    }

    build() {

        // Floor plane
        const geometry = new THREE.BoxGeometry(60, 60, 1);
        this.floorTexture = new THREE.MeshBasicMaterial({ map: this.textureFloorData, side: THREE.DoubleSide });
        this.floor = new THREE.Mesh(geometry, this.floorTexture);
        this.floor.rotation.set(Math.PI / 2, 0, 0);
        this.floor.position.set(0, 0, 0);
        this.graphics.add(this.floor);

        // Chess board
        const board_base = new THREE.BoxGeometry(30, 30, 0.4);
        const boardColour = new THREE.MeshBasicMaterial({ color: 0x393939 });
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
                const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

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

        // Board Numbers
        const loader = new FontLoader();
        loader.load('src/fonts/Montserrat_Bold.json', (font) => {
            const numberSpacing = 3; // Adjust the spacing between numbers
            const startingNumberX = -11; // Adjust the starting X position

            for (let i = 1; i <= 8; i++) {
                const numberText = i.toString();
                const geometry = new TextGeometry(numberText, {
                    font: font,
                    size: 1,
                    height: 0,
                });

                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({ color: 0xffffff })]);

                const xOffset = startingNumberX + (i - 1) * numberSpacing;
                textMesh.position.set(xOffset, 1, -14);
                textMesh.rotation.set(Math.PI / 2, Math.PI, Math.PI / 2);

                this.graphics.add(textMesh);
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
        
                const textMesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial({ color: 0xffffff })]);
        
                const xOffset = startingLetterX + i * letterSpacing + 3;
                textMesh.position.set(-14, 1, xOffset); // Adjust the Z position to place letters at the bottom
                textMesh.rotation.set(Math.PI / 2, Math.PI, Math.PI / 2);
        
                this.graphics.add(textMesh);
            }
        });

        // Plinths
        const plinthGroup = new THREE.Group();

        // Plinth (Box)
        const plinthBoxGeometry = new THREE.BoxGeometry(3, 0.8, 3);
        const plinthBoxMaterial = new THREE.MeshBasicMaterial({ map: this.plinthData, side: THREE.DoubleSide });
        const plinth = new THREE.Mesh(plinthBoxGeometry, plinthBoxMaterial);
        plinth.rotation.set(Math.PI / 2, 0, 0);
        plinth.position.set(25, -15, -0.9);

        // Cylinder 1
        const cylinderGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 15);
        const cylinderMaterial = new THREE.MeshBasicMaterial({ map: this.plinthData, side: THREE.DoubleSide });
        const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinderMesh.rotation.set(Math.PI/2, 0, 0);
        cylinderMesh.position.set(25, -15, -1.5); 

        // Cylinder 2
        const cylinderGeometry2 = new THREE.CylinderGeometry(1, 1, 3, 15);
        const cylinderMaterial2 = new THREE.MeshBasicMaterial({ map: this.plinthData, side: THREE.DoubleSide });
        const cylinderMesh2 = new THREE.Mesh(cylinderGeometry2, cylinderMaterial2);
        cylinderMesh2.rotation.set(Math.PI/2, 0, 0);
        cylinderMesh2.position.set(25, -15, -3); 

        // Cylinder 3
        const cylinderGeometry3 = new THREE.CylinderGeometry(1.5, 1.5, 0.3, 15);
        const cylinderMaterial3 = new THREE.MeshBasicMaterial({ map: this.plinthData, side: THREE.DoubleSide });
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
            this.floor.add(additionalPlinthGroup); // Add the cloned plinth group to the floor
        }


        // Add the board to the scene
        this.graphics.add(this.board);
    }

    
    

    update() { }

    destroy() { }
}
