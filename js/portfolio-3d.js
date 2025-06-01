// 3D Portfolio Viewer using Three.js

class PortfolioViewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.projects = [];
    this.currentIndex = 0;
    this.isAnimating = false;
    
    // Initialize Three.js components
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.controls = null;
    
    // Set up renderer
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);
    
    // Set up camera position
    this.camera.position.z = 5;
    
    // Set up controls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 8;
    
    // Add lights
    this.addLights();
    
    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
    
    // Start animation loop
    this.animate();
    
    // Add UI controls
    this.addControls();
  }
  
  addLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    // Directional light (like sunlight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
    
    // Point light (like a light bulb)
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(0, 2, 3);
    this.scene.add(pointLight);
  }
  
  onWindowResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    // Update controls
    if (this.controls) {
      this.controls.update();
    }
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
  
  addControls() {
    // Create navigation buttons
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'portfolio-3d-controls';
    
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.addEventListener('click', () => this.showPrevious());
    
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.addEventListener('click', () => this.showNext());
    
    const fullscreenButton = document.createElement('button');
    fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
    fullscreenButton.addEventListener('click', () => this.toggleFullscreen());
    
    controlsContainer.appendChild(prevButton);
    controlsContainer.appendChild(fullscreenButton);
    controlsContainer.appendChild(nextButton);
    
    this.container.appendChild(controlsContainer);
    
    // Create info panel
    this.infoPanel = document.createElement('div');
    this.infoPanel.className = 'portfolio-3d-info';
    this.container.appendChild(this.infoPanel);
  }
  
  loadProjects(projects) {
    this.projects = projects;
    
    // Clear existing objects
    while(this.scene.children.length > 0){ 
      this.scene.remove(this.scene.children[0]); 
    }
    
    // Re-add lights
    this.addLights();
    
    // Load the first project
    if (this.projects.length > 0) {
      this.loadProject(0);
    }
  }
  
  loadProject(index) {
    if (index < 0 || index >= this.projects.length || this.isAnimating) {
      return;
    }
    
    this.isAnimating = true;
    this.currentIndex = index;
    const project = this.projects[index];
    
    // Update info panel
    this.infoPanel.innerHTML = `
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="portfolio-3d-tags">
        ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
      </div>
      <a href="${project.link}" target="_blank" class="portfolio-3d-link">View Project</a>
    `;
    
    // Create a group for the new object
    const newGroup = new THREE.Group();
    
    // Load the 3D model or create a placeholder
    if (project.model) {
      const loader = new THREE.GLTFLoader();
      loader.load(project.model, (gltf) => {
        newGroup.add(gltf.scene);
        this.addNewObject(newGroup);
      });
    } else {
      // Create a placeholder geometry based on project type
      let geometry;
      
      if (project.type === 'web') {
        // Create a computer screen for web projects
        const screenGroup = new THREE.Group();
        
        // Monitor frame
        const frameGeometry = new THREE.BoxGeometry(3, 2, 0.1);
        const frameMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        screenGroup.add(frame);
        
        // Screen
        const screenGeometry = new THREE.PlaneGeometry(2.8, 1.8);
        const screenMaterial = new THREE.MeshBasicMaterial({ color: 0x6495ED });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.z = 0.06;
        screenGroup.add(screen);
        
        // Stand
        const standGeometry = new THREE.BoxGeometry(0.5, 1, 0.1);
        const stand = new THREE.Mesh(standGeometry, frameMaterial);
        stand.position.y = -1.5;
        screenGroup.add(stand);
        
        // Base
        const baseGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.5);
        const base = new THREE.Mesh(baseGeometry, frameMaterial);
        base.position.y = -2;
        screenGroup.add(base);
        
        newGroup.add(screenGroup);
      } else if (project.type === 'mobile') {
        // Create a smartphone for mobile projects
        const phoneGroup = new THREE.Group();
        
        // Phone body
        const bodyGeometry = new THREE.BoxGeometry(1.2, 2.2, 0.1);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        phoneGroup.add(body);
        
        // Phone screen
        const screenGeometry = new THREE.PlaneGeometry(1, 2);
        const screenMaterial = new THREE.MeshBasicMaterial({ color: 0x6495ED });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.z = 0.06;
        phoneGroup.add(screen);
        
        // Home button
        const buttonGeometry = new THREE.CircleGeometry(0.1, 32);
        const buttonMaterial = new THREE.MeshBasicMaterial({ color: 0xCCCCCC });
        const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
        button.position.y = -1;
        button.position.z = 0.06;
        phoneGroup.add(button);
        
        newGroup.add(phoneGroup);
      } else {
        // Default cube for other projects
        geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshPhongMaterial({ 
          color: 0x6495ED,
          transparent: true,
          opacity: 0.8
        });
        const cube = new THREE.Mesh(geometry, material);
        
        // Add wireframe
        const wireframe = new THREE.LineSegments(
          new THREE.EdgesGeometry(geometry),
          new THREE.LineBasicMaterial({ color: 0xffffff })
        );
        cube.add(wireframe);
        
        newGroup.add(cube);
      }
      
      this.addNewObject(newGroup);
    }
  }
  
  addNewObject(newGroup) {
    // Position the new group
    this.scene.add(newGroup);
    
    // Animate the new object appearing
    newGroup.scale.set(0.1, 0.1, 0.1);
    
    // Animation timeline
    const timeline = gsap.timeline({
      onComplete: () => {
        this.isAnimating = false;
      }
    });
    
    timeline.to(newGroup.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1,
      ease: 'elastic.out(1, 0.5)'
    });
    
    timeline.to(newGroup.rotation, {
      y: Math.PI * 2,
      duration: 2,
      ease: 'power1.inOut'
    }, '-=0.5');
  }
  
  showNext() {
    if (this.isAnimating) return;
    
    const nextIndex = (this.currentIndex + 1) % this.projects.length;
    this.loadProject(nextIndex);
  }
  
  showPrevious() {
    if (this.isAnimating) return;
    
    const prevIndex = (this.currentIndex - 1 + this.projects.length) % this.projects.length;
    this.loadProject(prevIndex);
  }
  
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.container.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }
}

// Initialize the portfolio viewer when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check if Three.js is loaded
  if (typeof THREE === 'undefined') {
    console.error('Three.js is not loaded. Please include the Three.js library.');
    return;
  }
  
  // Check if the container exists
  const container = document.getElementById('portfolio-3d-container');
  if (!container) {
    console.error('Portfolio 3D container not found.');
    return;
  }
  
  // Initialize the viewer
  const viewer = new PortfolioViewer('portfolio-3d-container');
  
  // Sample project data
  const projects = [
    {
      title: 'Personal Portfolio Website',
      description: 'A modern, responsive portfolio website built with Flask and modern front-end technologies.',
      technologies: ['HTML', 'CSS', 'JavaScript', 'Flask', 'Python'],
      type: 'web',
      link: '#'
    },
    {
      title: 'E-commerce Platform',
      description: 'A full-featured e-commerce platform with product management, cart functionality, and payment processing.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe API'],
      type: 'web',
      link: '#'
    },
    {
      title: 'Mobile Fitness App',
      description: 'A fitness tracking application for iOS and Android with workout plans, progress tracking, and social features.',
      technologies: ['React Native', 'Firebase', 'Redux', 'GraphQL'],
      type: 'mobile',
      link: '#'
    },
    {
      title: 'Data Visualization Dashboard',
      description: 'An interactive dashboard for visualizing complex datasets with filtering and export capabilities.',
      technologies: ['D3.js', 'Vue.js', 'Python', 'Flask', 'Pandas'],
      type: 'web',
      link: '#'
    }
  ];
  
  // Load the projects
  viewer.loadProjects(projects);
});
