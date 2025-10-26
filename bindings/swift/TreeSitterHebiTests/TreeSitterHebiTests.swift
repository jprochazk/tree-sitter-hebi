import XCTest
import SwiftTreeSitter
import TreeSitterHebi

final class TreeSitterHebiTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_hebi())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Hebi grammar")
    }
}
