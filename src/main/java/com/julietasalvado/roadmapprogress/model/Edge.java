package com.julietasalvado.roadmapprogress.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "roadmap_edges")
public class Edge {
  @Id
  String edgeId;
  String edgeFrom;
  String edgeTo;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "roadmap_id", nullable = false)
  private Roadmap roadmap;

  public String getId() {
    return this.edgeId;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Edge)) return false;
    Edge edge = (Edge) o;
    return getEdgeId().equals(edge.getEdgeId()) && getEdgeFrom().equals(edge.getEdgeFrom()) && getEdgeTo().equals(edge.getEdgeTo()) && getRoadmap().equals(edge.getRoadmap());
  }

  @Override
  public int hashCode() {
    return Objects.hash(getEdgeId(), getEdgeFrom(), getEdgeTo(), getRoadmap());
  }
}
