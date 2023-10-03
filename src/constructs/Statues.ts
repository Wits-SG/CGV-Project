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

        const loader = new FontLoader();
        loader.load('src/fonts/Montserrat_Bold.json',  (font) => {
            const geometry = new TextGeometry('1', {
                font: font,
                size: 1,
                height: 0,

            });

            const textMesh = new THREE.Mesh(geometry, [
                new THREE.MeshBasicMaterial({ color: 0xffffff}),
            ])

            textMesh.position.set(-11.5,1.15,-13);
            textMesh.rotation.set(Math.PI/2 ,Math.PI,Math.PI/2);

            this.graphics.add(textMesh);
        });

        
        





        // Add the board to the scene
        this.graphics.add(this.board);
    }

    
    

    update() { }

    destroy() { }
}
