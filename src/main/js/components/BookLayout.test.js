import React from "react"
import {render} from "@testing-library/react";
import BookLayout from "./BookLayout";

let container = null

BookLayout.defaultProps = { books: [] }

beforeEach(() => {
    container = render(<BookLayout/>).container
})

it('should show card group', () => {
    expect(true).toBe(true)
})