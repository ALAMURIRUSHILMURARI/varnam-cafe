document.addEventListener('DOMContentLoaded', () => {



  // --- 2. Immersive Morphing Liquid Background Canvas ---
  const canvas = document.createElement('canvas');
  canvas.className = 'liquid-bg-canvas';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Blob structure inspired by F1/tech design systems
  class FluidBlob {
    constructor(x, y, radius, color) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = 0.008 + Math.random() * 0.005;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
      this.points = [];
      this.numPoints = 8;
      for (let i = 0; i < this.numPoints; i++) {
        this.points.push({
          angle: (i / this.numPoints) * Math.PI * 2,
          offset: Math.random() * 25
        });
      }
    }

    update() {
      this.angle += this.speed;
      this.x += this.vx;
      this.y += this.vy;

      // Bounce boundaries
      if (this.x < -100 || this.x > width + 100) this.vx *= -1;
      if (this.y < -100 || this.y > height + 100) this.vy *= -1;

      // Deform nodes over time
      this.points.forEach((p, idx) => {
        p.currentRadius = this.radius + Math.sin(this.angle + idx * 1.5) * p.offset;
      });
    }

    draw() {
      ctx.beginPath();
      const firstPointX = this.x + Math.cos(this.points[0].angle) * this.points[0].currentRadius;
      const firstPointY = this.y + Math.sin(this.points[0].angle) * this.points[0].currentRadius;
      ctx.moveTo(firstPointX, firstPointY);

      for (let i = 0; i < this.numPoints; i++) {
        const nextIdx = (i + 1) % this.numPoints;
        const p1 = this.points[i];
        const p2 = this.points[nextIdx];
        
        const xc = this.x + Math.cos(p1.angle) * p1.currentRadius;
        const yc = this.y + Math.sin(p1.angle) * p1.currentRadius;
        const xnext = this.x + Math.cos(p2.angle) * p2.currentRadius;
        const ynext = this.y + Math.sin(p2.angle) * p2.currentRadius;

        const midX = (xc + xnext) / 2;
        const midY = (yc + ynext) / 2;
        ctx.quadraticCurveTo(xc, yc, midX, midY);
      }

      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // Neon highlights + raw clay palette (harmonious blending)
  const blobs = [
    new FluidBlob(width * 0.2, height * 0.3, 280, 'rgba(45, 127, 131, 0.06)'),   // Seafoam Teal
    new FluidBlob(width * 0.8, height * 0.7, 340, 'rgba(211, 107, 78, 0.05)'),   // Earth Terracotta
    new FluidBlob(width * 0.5, height * 0.5, 200, 'rgba(232, 222, 201, 0.07)')   // Sand Glaze
  ];

  const animateBackground = () => {
    ctx.clearRect(0, 0, width, height);
    blobs.forEach(blob => {
      blob.update();
      blob.draw();
    });
    requestAnimationFrame(animateBackground);
  };
  animateBackground();


  // --- 3. Interactive Menu Book Controls (Flipping Engine) ---
  const bookPages = document.querySelectorAll('.book-page');
  const btnNext = document.getElementById('btnNextPage');
  const btnPrev = document.getElementById('btnPrevPage');
  const indicator = document.getElementById('bookPageIndicator');
  let currentPageIndex = 0;

  const updateBookState = () => {
    bookPages.forEach((page, idx) => {
      page.classList.remove('active', 'flipped-left');
      if (idx === currentPageIndex) {
        page.classList.add('active');
      } else if (idx < currentPageIndex) {
        page.classList.add('flipped-left');
      }
    });

    // Update Controls & Page Count Indicator
    if (currentPageIndex === 0) {
      btnPrev.disabled = true;
      indicator.textContent = "Cover Page";
    } else {
      btnPrev.disabled = false;
      indicator.textContent = `Page ${currentPageIndex} of ${bookPages.length - 1}`;
    }

    if (currentPageIndex === bookPages.length - 1) {
      btnNext.disabled = true;
    } else {
      btnNext.disabled = false;
    }
  };

  if (btnNext && btnPrev) {
    btnNext.addEventListener('click', () => {
      if (currentPageIndex < bookPages.length - 1) {
        currentPageIndex++;
        updateBookState();
      }
    });

    btnPrev.addEventListener('click', () => {
      if (currentPageIndex > 0) {
        currentPageIndex--;
        updateBookState();
      }
    });

    // Clicking pages turns them
    bookPages.forEach((page, idx) => {
      page.addEventListener('click', (e) => {
        // If clicking on clickable sub-elements, do not flip automatically
        if (e.target.closest('a, button, select, input, option')) return;
        
        if (idx === currentPageIndex && currentPageIndex < bookPages.length - 1) {
          currentPageIndex++;
          updateBookState();
        }
      });
    });
  }


  // --- 4. Mobile Navigation Drawer ---
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }


  // --- 5. Scroll Header Shadow ---
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });


  // --- 6. Observers for Dynamic Page Reveals ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // --- 7. Immersive 3D Parallax Glare Card Grid Engine ---
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(card => {
    // Dynamically inject sheen highlight element inside the card
    if (!card.querySelector('.card-sheen')) {
      const sheen = document.createElement('div');
      sheen.className = 'card-sheen';
      card.appendChild(sheen);
    }

    card.addEventListener('mousemove', (e) => {
      // Only apply 3D tilt on desktop viewports
      if (window.innerWidth <= 768) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate relative coordinate offset from card center (-1 to 1)
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      // Max tilt angles: 12 degrees
      const maxRotateX = 12;
      const maxRotateY = 12;

      // Calculate rotation angles based on cursor offset
      const rotateX = -(deltaY * maxRotateX).toFixed(2);
      const rotateY = (deltaX * maxRotateY).toFixed(2);

      // Disable CSS transition during active mousemove for instant response
      card.style.transition = 'transform 0.1s ease, box-shadow 0.5s ease';
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;

      // Move radial light reflection glare based on cursor coordinates
      const sheen = card.querySelector('.card-sheen');
      if (sheen) {
        const percentX = ((x / rect.width) * 100).toFixed(1);
        const percentY = ((y / rect.height) * 100).toFixed(1);
        sheen.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 80%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      // Re-enable smooth transition easing on reset
      card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

      const sheen = card.querySelector('.card-sheen');
      if (sheen) {
        sheen.style.background = 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 80%)';
      }
    });
  });


  // --- 7.5 Immersive Gallery Lightbox Modal (Lando Norris style) ---
  const modal = document.getElementById('galleryModal');
  const modalImg = document.getElementById('modalMainImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalAuthor = document.getElementById('modalAuthor');
  const modalTag = document.getElementById('modalTag');
  const modalDesc = document.getElementById('modalDescription');
  const modalClay = document.getElementById('modalClay');
  const modalDate = document.getElementById('modalDate');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');

  if (modal) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const titleText = item.querySelector('h3').textContent;
        const authorText = item.querySelector('.gallery-author').textContent;
        const imgEl = item.querySelector('img');
        const imgSrc = imgEl.src;
        const imgAlt = imgEl.alt;

        const description = item.dataset.description || "A beautiful creation made on the pottery wheel.";
        const clay = item.dataset.clay || "Stoneware";
        const date = item.dataset.date || "Spring 2026";
        const badge = item.dataset.badge || "Student Art";
        const category = item.dataset.category || "pottery";

        // Dynamically change metadata labels depending on category
        const clayLabelSpan = modal.querySelector('.meta-item:nth-child(2) span');
        if (clayLabelSpan) {
          if (category === 'paint-art') {
            clayLabelSpan.textContent = 'Art Medium';
          } else {
            clayLabelSpan.textContent = 'Clay Type';
          }
        }

        // Bind data
        modalImg.src = imgSrc;
        modalImg.alt = imgAlt;
        modalTitle.textContent = titleText;
        modalAuthor.textContent = authorText;
        modalDesc.textContent = description;
        modalClay.textContent = clay;
        modalDate.textContent = date;
        modalTag.textContent = badge;

        // Show modal with 3D animation delay
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Disable background scrolling
      });
    });

    const closeModal = () => {
      modal.classList.remove('show');
      document.body.style.overflow = ''; // Restore background scrolling
    };

    modalCloseBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
      }
    });
  }


  // --- 8. Custom Interactive Calendar ---
  const calendarDaysContainer = document.getElementById('calendarDays');
  const calendarMonthYear = document.getElementById('calendarMonthYear');
  const timeSlotsContainer = document.getElementById('timeSlots');
  const dateInput = document.getElementById('bookingDate');
  const slotInput = document.getElementById('bookingSlot');

  if (calendarDaysContainer) {
    const today = new Date();
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();
    let selectedDateObj = null;

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const generateCalendar = (year, month) => {
      calendarDaysContainer.innerHTML = '';
      calendarMonthYear.textContent = `${monthNames[month]} ${year}`;

      // Render week day labels first
      const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
      dayLabels.forEach(label => {
        const labelDiv = document.createElement('div');
        labelDiv.classList.add('calendar-day-label');
        labelDiv.textContent = label;
        calendarDaysContainer.appendChild(labelDiv);
      });

      const firstDayIndex = new Date(year, month, 1).getDay();
      const totalDays = new Date(year, month + 1, 0).getDate();

      for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement('div');
        calendarDaysContainer.appendChild(emptyCell);
      }

      for (let day = 1; day <= totalDays; day++) {
        const dayBtn = document.createElement('button');
        dayBtn.type = 'button';
        dayBtn.classList.add('calendar-day');
        dayBtn.textContent = day;

        const dateObj = new Date(year, month, day);
        const compareToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        if (dateObj < compareToday) {
          dayBtn.disabled = true;
        }

        dayBtn.addEventListener('click', () => {
          document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
          dayBtn.classList.add('selected');
          selectedDateObj = dateObj;

          const yearStr = dateObj.getFullYear();
          const monthStr = String(dateObj.getMonth() + 1).padStart(2, '0');
          const dayStr = String(dateObj.getDate()).padStart(2, '0');
          dateInput.value = `${yearStr}-${monthStr}-${dayStr}`;
        });

        calendarDaysContainer.appendChild(dayBtn);
      }
    };

    generateCalendar(currentYear, currentMonth);

    const slots = ["09:00 AM - 11:00 AM", "11:30 AM - 01:30 PM", "02:30 PM - 04:30 PM", "05:00 PM - 07:00 PM"];
    slots.forEach(slot => {
      const slotDiv = document.createElement('div');
      slotDiv.classList.add('time-slot');
      slotDiv.textContent = slot;
      slotDiv.addEventListener('click', () => {
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        slotDiv.classList.add('selected');
        slotInput.value = slot;
      });
      timeSlotsContainer.appendChild(slotDiv);
    });
  }

  // --- 9. Booking Form Submission ---
  const bookingForm = document.getElementById('potteryBookingForm');
  const toast = document.getElementById('bookingToast');

  if (bookingForm && toast) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('bookingName').value;
      const email = document.getElementById('bookingEmail').value;
      const date = dateInput.value;
      const slot = slotInput.value;

      if (!name || !email || !date || !slot) {
        alert("Please complete the form, select a date from the calendar and a time slot.");
        return;
      }

      const toastMessage = document.getElementById('toastMessage');
      toastMessage.innerHTML = `<strong>Success!</strong> Pottery session booked for ${name} on ${date} (${slot}).`;

      toast.classList.add('show');
      bookingForm.reset();

      document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
      document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
      dateInput.value = '';
      slotInput.value = '';

      setTimeout(() => {
        toast.classList.remove('show');
      }, 5000);
    });
  }

  // --- 10. Scroll-Driven Clay Wheel Engine ---
  const wheelCanvas = document.getElementById('clay-wheel-canvas');
  const clayStateText = document.getElementById('clay-state-text');
  const wheelSection = document.getElementById('clay-wheel');

  if (wheelCanvas && wheelSection) {
    const wCtx = wheelCanvas.getContext('2d');
    
    // Support High-DPI screens for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = wheelCanvas.getBoundingClientRect();
    wheelCanvas.width = rect.width * dpr;
    wheelCanvas.height = rect.height * dpr;
    wCtx.scale(dpr, dpr);

    let canvasWidth = rect.width;
    let canvasHeight = rect.height;
    let centerX = canvasWidth / 2;
    
    // Clay state geometries (10 layers from top to bottom)
    const blockRadii = [75, 76, 77, 78, 79, 80, 80, 80, 80, 80];
    const cylinderRadii = [38, 38, 38, 38, 38, 38, 38, 38, 38, 38];
    const vaseRadii = [46, 32, 22, 24, 34, 46, 52, 48, 38, 32];
    
    const blockHeight = 65;
    const cylinderHeight = 135;
    const vaseHeight = 160;
    
    let yBase = canvasHeight * 0.8; // Base of clay on the wheel
    
    let targetProgress = 0;
    let currentProgress = 0; // LERPed progress for buttery smooth motion
    let isMouseOverCanvas = false;
    let currentMouseY = yBase;
    
    // Platter settings
    let platterY = canvasHeight * 0.8;
    let platterRadiusX = canvasWidth * 0.325;
    let platterRadiusY = platterRadiusX * 0.17;
    
    // Glaze Color Schemes (shadow, mid, base, highlight) in RGB for LERP transitions
    const glazes = {
      terracotta: {
        shadow: [122, 63, 38],
        mid: [150, 82, 52],
        base: [198, 120, 84],
        highlight: [212, 134, 98]
      },
      seafoam: {
        shadow: [25, 75, 78],
        mid: [45, 127, 131],
        base: [58, 180, 185],
        highlight: [210, 245, 246]
      },
      obsidian: {
        shadow: [15, 15, 15],
        mid: [30, 30, 30],
        base: [45, 45, 45],
        highlight: [220, 220, 220]
      },
      forest: {
        shadow: [20, 40, 18],
        mid: [35, 70, 32],
        base: [45, 90, 39],
        highlight: [200, 240, 195]
      },
      cobalt: {
        shadow: [20, 35, 60],
        mid: [33, 60, 105],
        base: [43, 76, 126],
        highlight: [200, 220, 255]
      }
    };

    let targetGlazeKey = 'terracotta';
    let currentGlazeColors = {
      shadow: [122, 63, 38],
      mid: [150, 82, 52],
      base: [198, 120, 84],
      highlight: [212, 134, 98]
    };
    
    // Spin animation angle
    let spinAngle = 0;
    
    // Particles (Droplets/Splatters)
    class Droplet {
      constructor() {
        this.reset();
      }
      reset() {
        this.angle = Math.random() * Math.PI * 2;
        this.distance = 40 + Math.random() * 80;
        this.speed = 1.0 + Math.random() * 1.5;
        this.yOffset = (Math.random() - 0.5) * 4;
        this.alpha = 0.4 + Math.random() * 0.6;
        this.size = 1.0 + Math.random() * 1.5;
      }
      update(speedMultiplier) {
        this.angle += 0.05 * speedMultiplier;
        this.distance += this.speed * speedMultiplier;
        this.alpha -= 0.015 * speedMultiplier;
        if (this.alpha <= 0 || this.distance > 150) {
          this.reset();
        }
      }
      draw() {
        const x = centerX + this.distance * Math.cos(this.angle);
        const y = platterY + this.distance * 0.18 * Math.sin(this.angle) + this.yOffset;
        const baseColor = currentGlazeColors.base;
        wCtx.fillStyle = `rgba(${Math.round(baseColor[0])}, ${Math.round(baseColor[1])}, ${Math.round(baseColor[2])}, ${this.alpha * 0.65})`;
        wCtx.beginPath();
        wCtx.arc(x, y, this.size, 0, 2 * Math.PI);
        wCtx.fill();
      }
    }
    
    const droplets = Array.from({ length: 15 }, () => new Droplet());
    
    wheelCanvas.addEventListener('mouseenter', () => {
      isMouseOverCanvas = true;
    });

    wheelCanvas.addEventListener('mouseleave', () => {
      isMouseOverCanvas = false;
    });

    wheelCanvas.addEventListener('mousemove', (e) => {
      isMouseOverCanvas = true;
      const rect = wheelCanvas.getBoundingClientRect();
      const y = e.clientY - rect.top;
      currentMouseY = y;
      
      const scale = canvasWidth / 400;
      const bottomY = yBase;
      const topY = yBase - (vaseHeight * scale) - (10 * scale);
      let progress = (bottomY - y) / (bottomY - topY);
      progress = Math.max(0, Math.min(1, progress));
      targetProgress = progress;
    });

    // Touch support for mobile!
    wheelCanvas.addEventListener('touchstart', (e) => {
      isMouseOverCanvas = true;
      if (e.touches.length > 0) {
        const rect = wheelCanvas.getBoundingClientRect();
        const y = e.touches[0].clientY - rect.top;
        currentMouseY = y;
      }
    });

    wheelCanvas.addEventListener('touchend', () => {
      isMouseOverCanvas = false;
    });

    wheelCanvas.addEventListener('touchmove', (e) => {
      isMouseOverCanvas = true;
      if (e.touches.length > 0) {
        const rect = wheelCanvas.getBoundingClientRect();
        const y = e.touches[0].clientY - rect.top;
        currentMouseY = y;
        
        const scale = canvasWidth / 400;
        const bottomY = yBase;
        const topY = yBase - (vaseHeight * scale) - (10 * scale);
        let progress = (bottomY - y) / (bottomY - topY);
        progress = Math.max(0, Math.min(1, progress));
        targetProgress = progress;
      }
    });

    // Hook up interactive glaze palette buttons
    const glazeButtons = document.querySelectorAll('.glaze-btn');
    glazeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        glazeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        targetGlazeKey = btn.dataset.glaze;
      });
    });

    window.addEventListener('resize', () => {
      // Re-scale canvas on resize
      const newRect = wheelCanvas.getBoundingClientRect();
      wheelCanvas.width = newRect.width * dpr;
      wheelCanvas.height = newRect.height * dpr;
      wCtx.scale(dpr, dpr);
      
      canvasWidth = newRect.width;
      canvasHeight = newRect.height;
      centerX = canvasWidth / 2;
      yBase = canvasHeight * 0.8;
      platterY = canvasHeight * 0.8;
      platterRadiusX = canvasWidth * 0.325;
      platterRadiusY = platterRadiusX * 0.17;
    });
    
    // Render loop
    const render = () => {
      // Clear canvas
      wCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      
      // Smooth LERP target progress
      currentProgress += (targetProgress - currentProgress) * 0.08;

      // Smooth LERP glaze color palette (transitioning dynamically)
      const targetGlaze = glazes[targetGlazeKey];
      for (const stopKey in currentGlazeColors) {
        for (let j = 0; j < 3; j++) {
          currentGlazeColors[stopKey][j] += (targetGlaze[stopKey][j] - currentGlazeColors[stopKey][j]) * 0.06;
        }
      }
      
      // Update text state based on progress
      if (currentProgress < 0.1) {
        clayStateText.textContent = "Raw Clay Block";
      } else if (currentProgress < 0.45) {
        clayStateText.textContent = "Centering Clay";
      } else if (currentProgress < 0.8) {
        clayStateText.textContent = "Opening Cylinder";
      } else {
        clayStateText.textContent = "Shaping Vase";
      }
      
      // Platter spin speed based on activity or scroll speed
      const speedMultiplier = 1.0;
      spinAngle += 0.04 * speedMultiplier;
      
      const scale = canvasWidth / 400;

      // Draw shadow under platter
      wCtx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      wCtx.beginPath();
      wCtx.ellipse(centerX, platterY + 12 * scale, platterRadiusX * 0.95, platterRadiusY * 0.95, 0, 0, 2 * Math.PI);
      wCtx.fill();
      
      // Draw platter base cylinder (thickness)
      wCtx.fillStyle = '#1e1e1e';
      wCtx.beginPath();
      wCtx.ellipse(centerX, platterY + 8 * scale, platterRadiusX, platterRadiusY, 0, 0, Math.PI);
      wCtx.lineTo(centerX - platterRadiusX, platterY);
      wCtx.ellipse(centerX, platterY, platterRadiusX, platterRadiusY, 0, Math.PI, 0);
      wCtx.lineTo(centerX + platterRadiusX, platterY + 8 * scale);
      wCtx.closePath();
      wCtx.fill();
      
      // Draw platter top disc
      wCtx.fillStyle = '#2c2c2c';
      wCtx.beginPath();
      wCtx.ellipse(centerX, platterY, platterRadiusX, platterRadiusY, 0, 0, 2 * Math.PI);
      wCtx.fill();
      wCtx.strokeStyle = '#3d3d3d';
      wCtx.lineWidth = 1.5;
      wCtx.stroke();
      
      // Draw radial lines on platter for spinning effect
      wCtx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
      wCtx.lineWidth = 1.5;
      for (let i = 0; i < 8; i++) {
        const angle = spinAngle + (i / 8) * Math.PI * 2;
        wCtx.beginPath();
        // Inner radius (starts under clay)
        const innerRad = 15 * scale;
        wCtx.moveTo(centerX + innerRad * Math.cos(angle), platterY + innerRad * 0.17 * Math.sin(angle));
        wCtx.lineTo(centerX + platterRadiusX * Math.cos(angle), platterY + platterRadiusY * Math.sin(angle));
        wCtx.stroke();
      }
      
      // Calculate dynamic geometry values based on currentProgress scaled
      const sBlockHeight = blockHeight * scale;
      const sCylinderHeight = cylinderHeight * scale;
      const sVaseHeight = vaseHeight * scale;

      let height = 0;
      const radii = [];
      let hollowR = 0;
      
      if (currentProgress < 0.5) {
        const p = currentProgress / 0.5;
        height = sBlockHeight * (1 - p) + sCylinderHeight * p;
        for (let i = 0; i < 10; i++) {
          const r = blockRadii[i] * (1 - p) + cylinderRadii[i] * p;
          radii.push(r * scale);
        }
        hollowR = (0 * (1 - p) + 32 * p) * scale;
      } else {
        const p = (currentProgress - 0.5) / 0.5;
        height = sCylinderHeight * (1 - p) + sVaseHeight * p;
        for (let i = 0; i < 10; i++) {
          const r = cylinderRadii[i] * (1 - p) + vaseRadii[i] * p;
          radii.push(r * scale);
        }
        hollowR = (32 * (1 - p) + (radii[0] / scale - 6) * p) * scale;
      }
      
      // y-coordinates for all layers
      const yCoords = [];
      for (let i = 0; i < 10; i++) {
        yCoords.push(yBase - height * (1 - i / 9));
      }
      
      // Draw clay shadow on platter
      const baseR = radii[9];
      wCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      wCtx.beginPath();
      wCtx.ellipse(centerX, yBase, baseR, baseR * 0.18, 0, 0, 2 * Math.PI);
      wCtx.fill();
      
      // Draw solid clay body
      wCtx.beginPath();
      wCtx.moveTo(centerX - baseR, yBase);
      // Left side curve (bottom-to-top)
      for (let i = 8; i >= 0; i--) {
        wCtx.lineTo(centerX - radii[i], yCoords[i]);
      }
      // Top rim connection
      wCtx.lineTo(centerX + radii[0], yCoords[0]);
      // Right side curve (top-to-bottom)
      for (let i = 1; i <= 9; i++) {
        wCtx.lineTo(centerX + radii[i], yCoords[i]);
      }
      // Bottom rim front curve
      wCtx.ellipse(centerX, yBase, baseR, baseR * 0.18, 0, 0, Math.PI, false);
      wCtx.closePath();
      
      // Clay Gradient Fill (3D cylinder lighting)
      const rgbStr = (arr) => `rgb(${Math.round(arr[0])}, ${Math.round(arr[1])}, ${Math.round(arr[2])})`;
      
      const clayGrad = wCtx.createLinearGradient(centerX - baseR, 0, centerX + baseR, 0);
      clayGrad.addColorStop(0.0, rgbStr(currentGlazeColors.shadow));
      clayGrad.addColorStop(0.2, rgbStr(currentGlazeColors.mid));
      clayGrad.addColorStop(0.5, rgbStr(currentGlazeColors.base));
      clayGrad.addColorStop(0.7, rgbStr(currentGlazeColors.highlight));
      clayGrad.addColorStop(0.9, rgbStr(currentGlazeColors.mid));
      clayGrad.addColorStop(1.0, rgbStr(currentGlazeColors.shadow));
      
      wCtx.fillStyle = clayGrad;
      wCtx.fill();
      
      // Stroke body outline for refinement
      wCtx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      wCtx.lineWidth = 1;
      wCtx.stroke();
      
      // Draw horizontal texture throwing rings
      const textures = [2, 4, 6, 8];
      textures.forEach(idx => {
        const ty = yCoords[idx];
        const tr = radii[idx];
        wCtx.beginPath();
        wCtx.ellipse(centerX, ty, tr, tr * 0.18, 0, 0, Math.PI);
        wCtx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        wCtx.lineWidth = 1.5;
        wCtx.stroke();
        
        wCtx.beginPath();
        wCtx.ellipse(centerX, ty + 1, tr, tr * 0.18, 0, 0, Math.PI);
        wCtx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        wCtx.lineWidth = 1;
        wCtx.stroke();
      });
      
      // Draw top opening (outer rim)
      const topR = radii[0];
      const topY = yCoords[0];
      wCtx.beginPath();
      wCtx.ellipse(centerX, topY, topR, topR * 0.18, 0, 0, 2 * Math.PI);
      
      const topGrad = wCtx.createLinearGradient(centerX - topR, 0, centerX + topR, 0);
      topGrad.addColorStop(0, rgbStr(currentGlazeColors.mid));
      topGrad.addColorStop(0.5, rgbStr(currentGlazeColors.base));
      topGrad.addColorStop(1, rgbStr(currentGlazeColors.mid));
      wCtx.fillStyle = topGrad;
      wCtx.fill();
      wCtx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      wCtx.stroke();
      
      // Draw hollow inner part if hollowR > 0
      if (hollowR > 0) {
        wCtx.beginPath();
        wCtx.ellipse(centerX, topY, hollowR, hollowR * 0.18, 0, 0, 2 * Math.PI);
        wCtx.fillStyle = '#30180F'; // Deep dark hole shadow
        wCtx.fill();
        
        wCtx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        wCtx.stroke();
      }

      // Draw glowing pressure ring at cursor Y if mouse is active on canvas
      if (isMouseOverCanvas && currentMouseY >= yCoords[0] && currentMouseY <= yBase) {
        // Find radius at currentMouseY
        let currentR = radii[9]; // default to base
        if (currentMouseY <= yCoords[0]) {
          currentR = radii[0];
        } else if (currentMouseY < yBase) {
          // Interpolate between layers
          for (let i = 0; i < 9; i++) {
            const yTop = yCoords[i];
            const yBot = yCoords[i + 1];
            if (currentMouseY >= yTop && currentMouseY <= yBot) {
              const ratio = (currentMouseY - yTop) / (yBot - yTop);
              currentR = radii[i] * (1 - ratio) + radii[i + 1] * ratio;
              break;
            }
          }
        }

        // Draw horizontal ring/ellipse around clay
        wCtx.beginPath();
        wCtx.ellipse(centerX, currentMouseY, currentR + 3, (currentR + 3) * 0.18, 0, 0, 2 * Math.PI);
        
        wCtx.strokeStyle = 'rgba(58, 180, 185, 0.8)'; // Neon glaze turquoise
        wCtx.lineWidth = 2.5;
        wCtx.stroke();
        
        // Draw tiny touch points at the sides of the clay representing the molding contact
        wCtx.fillStyle = '#D36B4E'; // Terracotta highlight
        wCtx.beginPath();
        wCtx.arc(centerX - currentR, currentMouseY, 4, 0, 2 * Math.PI);
        wCtx.fill();
        
        wCtx.beginPath();
        wCtx.arc(centerX + currentR, currentMouseY, 4, 0, 2 * Math.PI);
        wCtx.fill();
      }
      
      // Update and draw spin particles (splatters)
      droplets.forEach(d => {
        d.update(speedMultiplier);
        d.draw();
      });
      
      requestAnimationFrame(render);
    };
    
    render();
  }
});
