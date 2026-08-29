import networkx as nx
from typing import List, Dict, Any, Tuple
from ..schemas.models import AccountNode, TransactionEdge, EdgeStatus, NodeType

class GraphEngine:
    def __init__(self):
        pass

    def build_case_graph(self, nodes: List[AccountNode], edges: List[TransactionEdge]) -> nx.DiGraph:
        G = nx.DiGraph()
        for node in nodes:
            G.add_node(node.node_id, **node.model_dump())

        for edge in edges:
            G.add_edge(edge.source_node, edge.target_node, **edge.model_dump())

        return G

    def analyze_mule_behavior(self, nodes: List[AccountNode], edges: List[TransactionEdge]) -> Tuple[List[AccountNode], Dict[str, Any]]:
        G = self.build_case_graph(nodes, edges)
        updated_nodes = []

        total_hops = len([e for e in edges if e.status == EdgeStatus.CONFIRMED])
        pending_hops = len([e for e in edges if e.status == EdgeStatus.PENDING])
        unavailable_hops = len([e for e in edges if e.status == EdgeStatus.UNAVAILABLE])

        for node in nodes:
            node_dict = node.model_dump()
            in_edges = [e for e in edges if e.target_node == node.node_id and e.status == EdgeStatus.CONFIRMED]
            out_edges = [e for e in edges if e.source_node == node.node_id and e.status == EdgeStatus.CONFIRMED]

            rec_total = sum(e.amount_inr for e in in_edges)
            fwd_total = sum(e.amount_inr for e in out_edges)
            
            node_dict["total_received_inr"] = rec_total
            node_dict["total_forwarded_inr"] = fwd_total
            
            pass_through = (fwd_total / rec_total) if rec_total > 0 else 0.0
            node_dict["pass_through_ratio"] = round(pass_through, 3)

            # Calculate velocity
            vel_mins = None
            if in_edges and out_edges:
                # Compare hop timestamps
                vel_mins = out_edges[0].velocity_minutes_from_prior or 7.0
            node_dict["velocity_mins"] = vel_mins

            # Score behavioral mule-like pattern
            flags = []
            score = 0.1
            if node.node_type == NodeType.VICTIM:
                score = 0.05
                flags.append("Victim Anchor")
            elif node.node_type == NodeType.CASHOUT_DEST:
                score = 0.92
                flags.append("Terminal Cash-Out Target")
                flags.append("High Immediate ATM Risk")
            else:
                if pass_through > 0.70:
                    score += 0.35
                    flags.append(f"{int(pass_through*100)}% rapid pass-through")
                if vel_mins and vel_mins < 15:
                    score += 0.30
                    flags.append(f"Sub-15m velocity ({vel_mins:.0f}m hop)")
                if len(out_edges) > 1:
                    score += 0.15
                    flags.append("Layered split fan-out")
                if node.node_type == NodeType.MULE_LAYER_1:
                    flags.append("Layer 1 Intermediary Mule")
                    score += 0.10
                elif node.node_type == NodeType.MULE_LAYER_2:
                    flags.append("Layer 2 Concentrator Mule")
                    score += 0.15

            node_dict["risk_score"] = min(round(score, 2), 0.99)
            node_dict["flags"] = flags
            updated_nodes.append(AccountNode(**node_dict))

        metrics = {
            "total_hops": total_hops,
            "pending_hops": pending_hops,
            "unavailable_hops": unavailable_hops,
            "max_layer_depth": len([n for n in nodes if n.node_type != NodeType.VICTIM]),
            "graph_density": nx.density(G) if len(G) > 1 else 0.0
        }

        return updated_nodes, metrics

graph_engine = GraphEngine()
