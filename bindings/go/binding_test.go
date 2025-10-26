package tree_sitter_hebi_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_hebi "github.com/jprochazk/tree-sitter-hebi/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_hebi.Language())
	if language == nil {
		t.Errorf("Error loading Hebi grammar")
	}
}
