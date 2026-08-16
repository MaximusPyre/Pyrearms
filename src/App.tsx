import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { AdminConnect } from "./pages/AdminConnect";
import { Download } from "./pages/Download";
import { Home } from "./pages/Home";
import { Blog } from "./pages/Blog";
import { Legal } from "./pages/Legal";
import { LinkHub } from "./pages/LinkHub";
import { Story } from "./pages/Story";
import "./index.css";

function isLinkHubHost() {
	if (typeof window === "undefined") return false;
	return window.location.hostname === "max.pyrearms.dev";
}

export default function App() {
	if (isLinkHubHost()) {
		return <LinkHub />;
	}

	return (
		<BrowserRouter>
			<div className="app-shell">
				<Nav />
				<main>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/story" element={<Story />} />
						<Route path="/law" element={<Legal />} />
						<Route path="/blog" element={<Blog />} />
						<Route path="/legal" element={<Navigate to="/law" replace />} />
						<Route path="/download" element={<Download />} />
						<Route path="/admin" element={<AdminConnect />} />
						<Route path="/files" element={<Navigate to="/download" replace />} />
						<Route path="/kits" element={<Navigate to="/download" replace />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</main>
				<Footer />
			</div>
		</BrowserRouter>
	);
}
