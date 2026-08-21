import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { AdminConnect } from "./pages/AdminConnect";
import { Bodycams } from "./pages/Bodycams";
import { BodycamsPennsylvania } from "./pages/BodycamsPennsylvania";
import { Download } from "./pages/Download";
import { Home } from "./pages/Home";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { Legal } from "./pages/Legal";
import { StateLaw } from "./pages/StateLaw";
import { LinkHub } from "./pages/LinkHub";
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
						<Route path="/story" element={<Navigate to="/" replace />} />
						<Route path="/law" element={<Legal />} />
						<Route path="/law/:state" element={<StateLaw />} />
						<Route path="/blog" element={<Blog />} />
						<Route path="/blog/:slug" element={<BlogPost />} />
						<Route path="/legal" element={<Navigate to="/law" replace />} />
						<Route path="/download" element={<Download />} />
						<Route path="/bodycams" element={<Bodycams />} />
						<Route
							path="/bodycams/pennsylvania"
							element={<BodycamsPennsylvania />}
						/>
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
