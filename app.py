import streamlit as st

# Configure premium dark layout for the DTU evaluation presentation
st.set_page_config(
    page_title="ApartmentLink Control Center | DTU Portfolio Hub",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Glassmorphic Dark UI Styling
st.markdown("""
    <style>
    .main { background-color: #030712; color: #f1f5f9; }
    .stButton>button {
        background-color: #2563eb !important;
        color: white !important;
        border-radius: 12px !important;
        border: none !important;
        padding: 0.5rem 1.5rem !important;
        font-weight: bold !important;
    }
    </style>
""", unsafe_allow_html=True)

# --- SIDEBAR OPERATOR INDEX ---
with st.sidebar:
    st.title("🛸 System Control")
    st.markdown("---")
    st.subheader("Active Operator Context")
    st.code("Name: Demo Resident #01\nClearance: PRINCIPAL ENGINEER\nInstitution: DTU (ECE)")
    st.markdown("---")
    st.success("🤖 Core Matrix Connection Status: ONLINE")

# --- MAIN SCREEN BANNER HEADER ---
st.title("⚡ Enterprise Resource Mesh Portal")
st.markdown("#### **ApartmentLink System Deployment Hub**")
st.markdown("Welcome to the central portfolio showcase portal. Use the navigation anchors below to access the production environments, review the live git repositories, and inspect the structural architecture logs.")
st.markdown("---")

# --- DYNAMIC ACTION CALLS (SITE LINKS) ---
col1, col2 = st.columns(2)

with col1:
    st.info("### 🖥️ Live Production Application")
    st.write("Access the fully compiled, active full-stack interface running global resource lease locks and dynamic tab cross-calculations.")
    # Connected directly to your primary deployment tracking url
    st.link_button("🚀 Open Production Site Link", "https://github.com/Artnd342/Enterprise-Resource-Mesh")

with col2:
    st.success("### 📂 Open-Source Core Ledger Repository")
    st.write("Review the comprehensive code distribution ledger containing our React interfaces, protected backend API routers, and optimized scheduling schemas.")
    st.link_button("📦 Inspect GitHub Codebase", "https://github.com/Artnd342/Enterprise-Resource-Mesh")

st.markdown("---")

# --- TECH INFRASTRUCTURE LOGS ---
st.subheader("🛡️ Integrated Full-Stack Architecture Blueprint")
tab1, tab2, tab3 = st.tabs(["🚀 Frontend UI Matrix", "⚙️ Backend Broker", "🗄️ Relational DB Ledger"])

with tab1:
    st.markdown("""
    - **Framework Environment:** React 18 / Vite Engine
    - **Interface Utilities:** Tailwind CSS Dark-Cyber Ecosystem
    - **Stream Management:** Socket.io client loops tracking concurrent allocation signals smoothly.
    """)

with tab2:
    st.markdown("""
    - **Runtime Engine:** Node.js / Express Architecture Shields
    - **Network Sync Protocol:** WebSockets (`socket.io` server node clusters)
    - **Algorithmic Layer:** Implements a localized **Shortest Job First (SJF)** priority sequence computer to eliminate backlog turnaround latencies.
    """)

with tab3:
    st.markdown("""
    - **Database Platform:** PostgreSQL Relational Engine
    - **Connection Topology:** Distributed Pool Registry Parameterization (`pg` manager mapping up to 20 client pipelines concurrently)
    """)
