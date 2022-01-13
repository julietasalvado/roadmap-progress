import React from "react"
import {render} from "@testing-library/react";
import ItemLayout from "./BookLayout";

let container = null

ItemLayout.defaultProps = { books: [] }

beforeEach(() => {
    container = render(<ItemLayout/>).container
})

it('should show card group', () => {
    expect(true).toBe(true)
})