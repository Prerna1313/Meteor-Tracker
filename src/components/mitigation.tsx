'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Button, ProgressBar, Alert } from 'react-bootstrap';
import {
  FaMeteor, FaExclamationTriangle, FaSatelliteDish, FaSms, FaBroadcastTower,
  FaShieldAlt, FaRocket, FaSatellite, FaTelescope, FaUsers, FaGlobe, FaCheckCircle
} from 'react-icons/fa';

import 'bootstrap/dist/css/bootstrap.min.css';

const MODALS = [
  'deflection', 'impactor', 'neo', 'observation', 'defense', 'cooperation', 'sos', 'sms'
] as const;
type ModalType = typeof MODALS[number] | null;

export default function MitigationPage() {
  // Modal state
  const [modal, setModal] = useState<ModalType>(null);
  // Notification state
  const [notification, setNotification] = useState<{ type: 'success' | 'warning', message: string } | null>(null);
  // Last scan time
  const [lastScan, setLastScan] = useState('2 minutes ago');

  // Scan timer logic
  useEffect(() => {
    const updateScan = () => {
      setLastScan('Just now');
      setTimeout(() => setLastScan('1 minute ago'), 60000);
    };
    const interval = setInterval(updateScan, 120000);
    return () => clearInterval(interval);
  }, []);

  // Meteor animation (simple, not CSS keyframes)
  useEffect(() => {
    const starsContainer = document.getElementById('stars-container');
    if (!starsContainer) return;
    const createMeteor = () => {
      const meteor = document.createElement('div');
      meteor.className = 'meteor';
      meteor.style.top = Math.random() * 100 + '%';
      meteor.style.left = Math.random() * 100 + '%';
      meteor.style.animationDelay = Math.random() * 3 + 's';
      starsContainer.appendChild(meteor);
      setTimeout(() => meteor.remove(), 3000);
    };
    const interval = setInterval(createMeteor, 2000);
    return () => clearInterval(interval);
  }, []);

  // Notification timeout
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Smooth scroll for nav links
  useEffect(() => {
    const handler = (e: any) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handler);
    });
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handler);
      });
    };
  }, []);

  // Modal openers
  const openModal = (type: ModalType) => setModal(type);

  // Modal closers
  const closeModal = () => setModal(null);

  // Button actions
  const activateSOS = () => openModal('sos');
  const sendSMSAlert = () => openModal('sms');
  const confirmSMS = () => {
    closeModal();
    setNotification({ type: 'success', message: 'SMS alerts sent successfully!' });
  };
  const broadcastEmergency = () => {
    setNotification({ type: 'warning', message: 'Emergency broadcast initiated on all channels!' });
  };

  // Styles (inline for brevity, can be moved to CSS module)
  const styles = {
    root: {
      fontFamily: "'Montserrat', sans-serif",
      background: "#000",
      color: "#fff",
      minHeight: "100vh",
      overflowX: "hidden"
    },
    starsContainer: {
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1,
      overflow: 'hidden',
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px), radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
      backgroundSize: '50px 50px', backgroundPosition: '0 0, 25px 25px'
    },
    meteor: {
      position: 'absolute', width: 2, height: 2, background: 'white',
      boxShadow: '0 0 10px 2px rgba(255,255,255,0.8)', opacity: 0,
      animation: 'meteor 3s linear infinite'
    },
    header: {
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', padding: '1rem 0',
      borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'sticky', top: 0, zIndex: 1000
    },
    navBrand: {
      fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center'
    },
    heroSection: {
      padding: '150px 0', textAlign: 'center'
    },
    heroTitle: {
      fontFamily: "'Roboto Mono', monospace", fontSize: '5rem', fontWeight: 'bold',
      letterSpacing: '12px', marginBottom: 20, color: '#fff'
    },
    heroSubtitle: {
      fontSize: '1.3rem', color: '#a0a9b8', maxWidth: 800, margin: '0 auto 40px',
      letterSpacing: '2px', textTransform: 'uppercase'
    },
    section: { padding: '80px 0' },
    card: {
      background: 'rgba(255,255,255,0.05)', borderRadius: 0, padding: 30, marginBottom: 50,
      backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)'
    },
    strategyGrid: {
      display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center'
    },
    strategyCard: {
      background: 'rgba(255,255,255,0.05)', borderRadius: 0, padding: 30, marginBottom: 50,
      backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', width: 300
    },
    strategyIcon: { fontSize: '3rem', marginBottom: 20, color: '#fff' },
    strategyTitle: { fontSize: '1.5rem', marginBottom: 15, color: '#fff', letterSpacing: '2px' },
    strategyDescription: { color: '#a0a9b8' },
    strategyBtn: {
      background: 'none', color: '#fff', border: '1px solid #fff', padding: '10px 20px',
      borderRadius: 0, cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginTop: 20
    },
    telescopeCard: {
      background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0, padding: 20, margin: 10, minWidth: 220
    },
    telescopeIcon: { color: '#fff', fontSize: '2rem' },
    telescopeName: { color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' },
    telescopeStatus: { color: '#a0a9b8' },
    footer: {
      background: '#000', padding: '40px 0', textAlign: 'center',
      borderTop: '1px solid rgba(255,255,255,0.1)'
    },
    footerLinks: { display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 10 }
  };

  return (
    <div style={styles.root}>
      {/* Animated Background */}
      <div id="stars-container" style={styles.starsContainer}>
        {/* Initial meteors */}
        <div className="meteor" style={{ ...styles.meteor, top: '10%', left: '80%' }} />
        <div className="meteor" style={{ ...styles.meteor, top: '30%', left: '60%' }} />
        <div className="meteor" style={{ ...styles.meteor, top: '50%', left: '40%' }} />
        <style>{`
          @keyframes meteor {
            0% { transform: translate(0,0) rotate(215deg); opacity: 1; }
            70% { opacity: 1; }
            100% { transform: translate(-500px,500px) rotate(215deg); opacity: 0; }
          }
        `}</style>
      </div>

      {/* Header */}
      <header style={styles.header}>
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <a className="navbar-brand" href="#" style={styles.navBrand}>
              <FaMeteor style={{ marginRight: 10 }} />
              EYES ON METEORS
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item"><a className="nav-link" href="#home">Home</a></li>
                <li className="nav-item"><a className="nav-link" href="#strategies">Strategies</a></li>
                <li className="nav-item"><a className="nav-link" href="#observations">Observations</a></li>
                <li className="nav-item"><a className="nav-link" href="#alerts">Alerts</a></li>
                <li className="nav-item"><a className="nav-link" href="#contact">Contact</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section" id="home" style={styles.heroSection}>
        <div className="container">
          <h1 style={styles.heroTitle}>MITIGATION STRATEGIES</h1>
          <p style={styles.heroSubtitle}>
            Protecting Earth from celestial threats through advanced detection, deflection technologies, and coordinated civil defense systems
          </p>
        </div>
      </section>

      {/* Alerts Section */}
      <section className="container" id="alerts" style={styles.section}>
        <div className="alert-system" style={styles.card}>
          <div className="alert-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FaExclamationTriangle />
            <h2 style={{ margin: 0 }}>Civil Defense Alert System</h2>
          </div>
          <div className="alert-status" style={{ margin: '20px 0' }}>
            <div className="status-indicator" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="status-dot status-safe" style={{
                width: 12, height: 12, borderRadius: '50%', background: '#2ecc71', display: 'inline-block'
              }} />
              <span>Current Status: No Immediate Threats Detected</span>
            </div>
            <div>
              <span>Last Scan: <span id="lastScan">{lastScan}</span></span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <Button variant="outline-light" className="w-100 strategy-btn" onClick={activateSOS}>
                <FaSatelliteDish className="me-2" />
                Activate SOS Alert
              </Button>
            </div>
            <div className="col-md-4 mb-3">
              <Button variant="outline-light" className="w-100 strategy-btn" onClick={sendSMSAlert}>
                <FaSms className="me-2" />
                Send SMS Alert
              </Button>
            </div>
            <div className="col-md-4 mb-3">
              <Button variant="outline-light" className="w-100 strategy-btn" onClick={broadcastEmergency}>
                <FaBroadcastTower className="me-2" />
                Emergency Broadcast
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Strategies Section */}
      <section className="container" id="strategies" style={styles.section}>
        <h2 className="text-center mb-5" style={{ fontSize: '2.5rem', color: '#fff' }}>
          Mitigation Strategies
        </h2>
        <div className="strategy-grid" style={styles.strategyGrid}>
          <div className="strategy-card" style={styles.strategyCard}>
            <FaShieldAlt style={styles.strategyIcon} />
            <h3 style={styles.strategyTitle}>Deflection Systems</h3>
            <p style={styles.strategyDescription}>
              Advanced gravitational and kinetic deflection technologies to alter asteroid trajectories away from Earth's path.
            </p>
            <Button variant="outline-light" style={styles.strategyBtn} onClick={() => openModal('deflection')}>Learn More</Button>
          </div>
          <div className="strategy-card" style={styles.strategyCard}>
            <FaRocket style={styles.strategyIcon} />
            <h3 style={styles.strategyTitle}>Kinetic Impactor</h3>
            <p style={styles.strategyDescription}>
              High-velocity spacecraft designed to collide with threatening objects, changing their course through momentum transfer.
            </p>
            <Button variant="outline-light" style={styles.strategyBtn} onClick={() => openModal('impactor')}>Learn More</Button>
          </div>
          <div className="strategy-card" style={styles.strategyCard}>
            <FaSatellite style={styles.strategyIcon} />
            <h3 style={styles.strategyTitle}>NEO Surveys</h3>
            <p style={styles.strategyDescription}>
              Near-Earth Object detection networks scanning the cosmos for potentially hazardous asteroids and comets.
            </p>
            <Button variant="outline-light" style={styles.strategyBtn} onClick={() => openModal('neo')}>Learn More</Button>
          </div>
          <div className="strategy-card" style={styles.strategyCard}>
            <FaTelescope style={styles.strategyIcon} />
            <h3 style={styles.strategyTitle}>Space-Based Observations</h3>
            <p style={styles.strategyDescription}>
              Orbital telescopes and sensors providing continuous monitoring of space objects beyond Earth's atmosphere.
            </p>
            <Button variant="outline-light" style={styles.strategyBtn} onClick={() => openModal('observation')}>Learn More</Button>
          </div>
          <div className="strategy-card" style={styles.strategyCard}>
            <FaUsers style={styles.strategyIcon} />
            <h3 style={styles.strategyTitle}>Civil Defense</h3>
            <p style={styles.strategyDescription}>
              Coordinated emergency response systems including evacuation plans and public alert mechanisms.
            </p>
            <Button variant="outline-light" style={styles.strategyBtn} onClick={() => openModal('defense')}>Learn More</Button>
          </div>
          <div className="strategy-card" style={styles.strategyCard}>
            <FaGlobe style={styles.strategyIcon} />
            <h3 style={styles.strategyTitle}>International Cooperation</h3>
            <p style={styles.strategyDescription}>
              Global collaboration between space agencies and governments for unified planetary defense.
            </p>
            <Button variant="outline-light" style={styles.strategyBtn} onClick={() => openModal('cooperation')}>Learn More</Button>
          </div>
        </div>
      </section>

      {/* Observations Section */}
      <section className="container" id="observations" style={styles.section}>
        <div className="observation-section" style={styles.card}>
          <div className="observation-header">
            <h2 style={styles.strategyTitle}>Active Observation Systems</h2>
            <p style={styles.strategyDescription}>Real-time monitoring of near-Earth objects</p>
          </div>
          <div className="telescope-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            <div className="telescope-card" style={styles.telescopeCard}>
              <FaSatelliteDish style={styles.telescopeIcon} />
              <h4 style={styles.telescopeName}>Hubble NEO Tracker</h4>
              <p style={styles.telescopeStatus}>Status: Active | Scanning: 150° sector</p>
            </div>
            <div className="telescope-card" style={styles.telescopeCard}>
              <FaSatellite style={styles.telescopeIcon} />
              <h4 style={styles.telescopeName}>NEOWISE Observatory</h4>
              <p style={styles.telescopeStatus}>Status: Active | Objects Tracked: 247</p>
            </div>
            <div className="telescope-card" style={styles.telescopeCard}>
              <FaBroadcastTower style={styles.telescopeIcon} />
              <h4 style={styles.telescopeName}>Deep Space Radar</h4>
              <p style={styles.telescopeStatus}>Status: Active | Range: 0.5 AU</p>
            </div>
            <div className="telescope-card" style={styles.telescopeCard}>
              <FaSatellite style={styles.telescopeIcon} />
              <h4 style={styles.telescopeName}>Planetary Defense Array</h4>
              <p style={styles.telescopeStatus}>Status: Standby | Last Alert: 72h ago</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" style={styles.footer}>
        <div className="container">
          <div className="footer-links" style={styles.footerLinks}>
            <a href="#">About</a>
            <a href="#">Research</a>
            <a href="#">Partners</a>
            <a href="#">Resources</a>
            <a href="#">Contact</a>
          </div>
          <p>&copy; 2024 Eyes on Meteor. Protecting Earth Together.</p>
        </div>
      </footer>

      {/* Modals */}
      <Modal show={modal === 'deflection'} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton><Modal.Title>Deflection Systems Details</Modal.Title></Modal.Header>
        <Modal.Body>
          <h4>Gravity Tractor Method</h4>
          <p>A spacecraft positioned near an asteroid uses mutual gravitational attraction to slowly alter its trajectory over time.</p>
          <h4 className="mt-3">Ion Beam Deflection</h4>
          <p>Directed ion thrusters create a continuous push on the asteroid surface, gradually changing its path.</p>
          <h4 className="mt-3">Solar Sail Technology</h4>
          <p>Large reflective sails harness solar radiation pressure to provide continuous deflection force.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={modal === 'impactor'} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton><Modal.Title>Kinetic Impactor Details</Modal.Title></Modal.Header>
        <Modal.Body>
          <h4>NASA DART Mission Success</h4>
          <p>The Double Asteroid Redirection Test successfully demonstrated kinetic impact technology by altering the orbit of Dimorphos asteroid.</p>
          <h4 className="mt-3">Impact Velocity</h4>
          <p>Typical impactors travel at 6-10 km/s, delivering sufficient momentum to change asteroid trajectories.</p>
          <h4 className="mt-3">Multi-Impactor Strategy</h4>
          <p>Multiple smaller impacts can be more effective than a single large impact for certain asteroid types.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={modal === 'neo'} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton><Modal.Title>NEO Survey Details</Modal.Title></Modal.Header>
        <Modal.Body>
          <h4>Pan-STARRS Telescope</h4>
          <p>Surveying the entire night sky every few days to detect moving objects and potential threats.</p>
          <h4 className="mt-3">Catalina Sky Survey</h4>
          <p>Discovering more comets and NEOs than any other survey program.</p>
          <h4 className="mt-3">ATLAS Project</h4>
          <p>Providing one-day warning for 30-meter asteroids and three-week warning for 45-meter asteroids.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={modal === 'observation'} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton><Modal.Title>Space-Based Observation Details</Modal.Title></Modal.Header>
        <Modal.Body>
          <h4>NEOCam Infrared Telescope</h4>
          <p>Space-based infrared telescope capable of detecting dark asteroids that are difficult to see from Earth.</p>
          <h4 className="mt-3">Lagrange Point Observatories</h4>
          <p>Positioned at stable points in space to provide continuous monitoring without Earth's interference.</p>
          <h4 className="mt-3">CubeSat Constellation</h4>
          <p>Network of small satellites providing wide-angle coverage of near-Earth space.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={modal === 'defense'} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton><Modal.Title>Civil Defense Details</Modal.Title></Modal.Header>
        <Modal.Body>
          <h4>Emergency Alert System</h4>
          <p>Integrated warning system reaching all citizens through multiple channels including mobile, broadcast, and sirens.</p>
          <h4 className="mt-3">Evacuation Protocols</h4>
          <p>Pre-planned evacuation routes and shelters for impact zones with capacity for millions.</p>
          <h4 className="mt-3">Public Education</h4>
          <p>Regular drills and educational programs to ensure public awareness and preparedness.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={modal === 'cooperation'} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton><Modal.Title>International Cooperation Details</Modal.Title></Modal.Header>
        <Modal.Body>
          <h4>Planetary Defense Coordination Office</h4>
          <p>NASA-led international effort coordinating detection, tracking, and mitigation efforts worldwide.</p>
          <h4 className="mt-3">Space Mission Planning</h4>
          <p>Joint missions between ESA, JAXA, Roscosmos, and other space agencies for planetary defense.</p>
          <h4 className="mt-3">Data Sharing Network</h4>
          <p>Global network sharing observation data and threat assessments in real-time.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={modal === 'sos'} onHide={closeModal} centered>
        <Modal.Header closeButton><Modal.Title>SOS Alert System</Modal.Title></Modal.Header>
        <Modal.Body>
          <Alert variant="danger"><FaExclamationTriangle className="me-2" /> Emergency Protocol Activated</Alert>
          <p>SOS signals have been broadcast to all emergency response centers. Estimated response time: 3 minutes.</p>
          <ProgressBar now={75} variant="danger" className="mt-3" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={modal === 'sms'} onHide={closeModal} centered>
        <Modal.Header closeButton><Modal.Title>SMS Alert System</Modal.Title></Modal.Header>
        <Modal.Body>
          <Alert variant="info"><FaSms className="me-2" /> Alert Message Prepared</Alert>
          <p>Emergency SMS will be sent to 2.4 million subscribers in the affected area.</p>
          <div className="form-group mt-3">
            <label htmlFor="messageArea">Message Preview:</label>
            <textarea className="form-control" id="messageArea" rows={3} readOnly
              defaultValue="METEOR ALERT: Seek shelter immediately. Impact expected in 45 minutes. Follow evacuation routes. Stay tuned for updates." />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={confirmSMS}>Send Alert</Button>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
        </Modal.Footer>
      </Modal>

      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
          minWidth: 300
        }}>
          <Alert variant={notification.type === 'success' ? 'success' : 'warning'}>
            {notification.type === 'success' ? <FaCheckCircle className="me-2" /> : <FaBroadcastTower className="me-2" />}
            {notification.message}
          </Alert>
        </div>
      )}
    </div>
  );
}