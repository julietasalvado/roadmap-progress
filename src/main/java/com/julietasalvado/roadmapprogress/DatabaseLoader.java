/*
 * Copyright 2015 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.julietasalvado.roadmapprogress;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// tag::code[]
@Component
public class DatabaseLoader implements CommandLineRunner {

	private final BookRepository repository;

	@Autowired
	public DatabaseLoader(BookRepository repository) {
		this.repository = repository;
	}

	@Override
	public void run(String... strings) throws Exception {
		this.repository.save(Book.builder()
						.title("Make It Stick: The Science of Successful Learning")
						.coverUrl("https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1436742344l/18770267._SY475_.jpg")
						.build());
		this.repository.save(Book.builder()
						.title("How to Take Smart Notes")
						.coverUrl("https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1488937626l/34507927._SY475_.jpg")
						.build());
		this.repository.save(Book.builder()
						.title("Ultralearning")
						.coverUrl("https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1554211384l/44770129._SY475_.jpg")
						.build()
	);
	}
}
// end::code[]
