<?php
class Category
{
    private $conn;
    private $table = 'category';

    public $category_id;
    public $category;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function create(){
        $query = 'INSERT INTO ' . $this->table . '
            SET
                category = :category';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':category', $this->category);

        if($stmt->execute()){
            $this->category_id = $this->conn->lastInsertId();
            return true;
        }

        printf("Error: %s. \n", $stmt->error);
        return false;
    }

    public function read(){
        $query = 'SELECT *
          FROM
            ' . $this->table . ' t
          ORDER BY
            t.category';

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function read_single(){
        $where = array();
        if (isset($this->category_id)) array_push($where, 't.category_id = :category_id');
        if (isset($this->category)) array_push($where, 't.category = :category');
        $where_clause = empty($where) ? '' : 'WHERE ' . implode(' AND ', $where);

        $query = 'SELECT *
          FROM
            ' . $this->table . ' t '.
          $where_clause;

        $stmt = $this->conn->prepare($query);

        if (isset($this->category_id)) $stmt->bindParam(':category_id', $this->category_id);
        if (isset($this->category)) $stmt->bindParam(':category', $this->category);

        $stmt->execute();
        return $stmt;
    }
}