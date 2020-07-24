<?php
class Tag
{
    private $conn;
    private $table = 'tag';

    public $tag_id;
    public $tag;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function create(){
        $query = 'INSERT INTO ' . $this->table . '
            SET
                tag = :tag';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':tag', $this->tag);

        if($stmt->execute()){
            $this->tag_id = $this->conn->lastInsertId();
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
            t.tag';

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}