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
}
